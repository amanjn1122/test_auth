import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const secret = process.env.JWT_SECRET_PUBLIC;

    if (!secret) {
        return res.status(500).json({ message: 'Server configuration error: JWT_SECRET_PUBLIC is not defined' });
    }

    try {
        // The secret is now guaranteed to be defined, so we can pass it safely to jwt.verify
        const decoded = jwt.verify(token, secret);
        res.status(200).json({ user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
