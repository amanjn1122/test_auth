import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '@/utils/utils';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const secret = process.env.JWT_SECRET_REFRESH_TOKEN_PUBLIC;

    if (!secret) {
        return res.status(500).json({ message: 'Server configuration error: JWT_SECRET_REFRESH_TOKEN_PUBLIC is not defined' });
    }

    try {
        // The secret is now guaranteed to be defined, so we can pass it safely to jwt.verify
        const decoded = jwt.verify(token, secret) as {email: string, name: string};

        const accessToken = generateAccessToken(decoded);

        dbConnect();
        const user = await User.findOne({email: decoded.email});
        if(user.session.refreshToken === token){
            await User.updateOne({email: decoded.email}, {$set: { 'session.accessToken': accessToken} })
        }
        else{
            throw new Error("Session is logged out or check the refresh token");
            
        }

        res.status(200).json({ token: accessToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
