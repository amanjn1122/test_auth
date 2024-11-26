// import axios from 'axios';

const googleOAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
const githubOAuthUrl = 'https://github.com/login/oauth/authorize';

export const getGoogleAuthUrl = () => {
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
    const clientId = process.env.GOOGLE_ID;
    const scope = 'openid+profile+email';
    
    return `${googleOAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  };
  

/**
 * Generates the GitHub OAuth URL for authentication
 */
export const getGithubAuthUrl = () => {
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/github`;
    const clientId = process.env.GITHUB_ID;

    // Construct the OAuth URL with necessary parameters
    return `${githubOAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
};
