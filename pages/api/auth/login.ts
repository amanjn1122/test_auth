// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getGoogleAuthUrl, getGithubAuthUrl } from '@/lib/oauthClients';  // OAuth URL generation logic
import { redirectMap } from '@/shared/memory';

// In-memory store for redirect_to values, using a Map
// export const redirectMap = new Map<string, string>();

function generateUniqueKey(): string {
  return Math.random().toString(36).substring(2);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider, redirect_to } = req.query;  // Either 'google' or 'github'

  if (!redirect_to) {
    return res.status(400).json({ message: 'Missing redirect_to parameter' });
  }

  // Generate a unique key (could use a random string, or any other unique identifier)
  const uniqueKey = generateUniqueKey();

  // Store the redirect_to value in the in-memory map with the unique key
  redirectMap.set(uniqueKey, redirect_to as string);
  // console.log("inmemory map (login)->>",redirectMap)


  // If the provider is Google, redirect the user to Google OAuth login URL
  if (provider === 'google') {
    return res.status(200).json({auth_link:getGoogleAuthUrl()+"&state="+uniqueKey});  // Redirecting to the Google OAuth URL
  }

  // If the provider is GitHub, redirect the user to GitHub OAuth login URL
  if (provider === 'github') {
    return res.status(200).json({auth_link:getGithubAuthUrl()+"&state="+uniqueKey});  // Redirecting to the GitHub OAuth URL
  }

  // If the provider is invalid, send an error response
  return res.status(400).json({ message: 'Invalid provider' });
}
