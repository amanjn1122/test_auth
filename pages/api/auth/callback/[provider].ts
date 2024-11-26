// pages/api/auth/callback/[provider].ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider } = req.query;  // 'google' or 'github'
  // const code = req.query.code as string;
  const { code, state } = req.query;  // 'code' is the authorization code returned by Google
  const redirectUri = state as string; // Use the `state` param to redirect user to the original `redirect` URL.

  console.log("url ---->>>",redirectUri)

  if (!code) {
    return res.status(400).json({ message: 'Missing authorization code' });
  }

  try {
    let tokenUrl, tokenData;
    if (provider === 'google') {
      tokenUrl = 'https://oauth2.googleapis.com/token';
      tokenData = {
        code,
        client_id: process.env.GOOGLE_ID,
        client_secret: process.env.GOOGLE_SECRET,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      };
    } else if (provider === 'github') {
      tokenUrl = 'https://github.com/login/oauth/access_token';
      tokenData = {
        client_id: process.env.GITHUB_ID,
        client_secret: process.env.GITHUB_SECRET,
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
      };
    } else {
      return res.status(400).json({ message: 'Invalid provider' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(tokenUrl, tokenData, {
      headers: { 'Accept': 'application/json' },
    });

    const { access_token } = tokenResponse.data;
    // console.log(tokenResponse)

    // Get user info using the access token
    let userResponse;
    if (provider === 'google') {
      userResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
    } else if (provider === 'github') {
      const userEmails = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const userDataResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      userResponse={data:{email:userEmails.data[0].email,
        name: userDataResponse.data.login
      }}
    }

    if (!userResponse?.data) {
      return res.status(500).json({ message: 'Failed to fetch user info' });
    }

    // console.log("user data -->>>>",userResponse.data)
    // userResponse.data.email=userResponse.data[0].email
    // userResponse.data.name="aaa"
    const user = userResponse.data;
    await dbConnect();

    // Check if the user exists, otherwise create a new one
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      await User.create({ email: user.email, name: user.name, image: user.avatar_url });
    }

    // Ensure JWT_SECRET is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET is not defined' });
    }

    // Create a JWT token to maintain the session
    const token = jwt.sign({ email: user.email, name: user.name }, jwtSecret, { expiresIn: '1h' });

    
    // Redirect to the dashboard with the token as query parameter
    return res.redirect(redirectUri+"?token="+token);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Authentication failed' });
  }
}
