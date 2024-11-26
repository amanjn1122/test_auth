// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleAuthUrl, getGithubAuthUrl } from '@/lib/oauthClients';  // OAuth URL generation logic

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider, redirect_to } = req.query;  // Either 'google' or 'github'

  // If the provider is Google, redirect the user to Google OAuth login URL
  if (provider === 'google') {
    return res.status(200).json({auth_link:getGoogleAuthUrl()+"&state="+redirect_to});  // Redirecting to the Google OAuth URL
  }

  // If the provider is GitHub, redirect the user to GitHub OAuth login URL
  if (provider === 'github') {
    return res.status(200).json({auth_link:getGithubAuthUrl()+"&state="+redirect_to});  // Redirecting to the GitHub OAuth URL
  }

  // If the provider is invalid, send an error response
  return res.status(400).json({ message: 'Invalid provider' });
}
