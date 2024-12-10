import dbConnect from "@/lib/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import User from "@/models/User";
import { fetchUser } from "@/utils/utils";
// import { destroyCookie } from 'nookies'; // nookies for cookie manipulation

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {

            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const secret = process.env.JWT_SECRET_PUBLIC;

            if (!secret) {
                return res.status(500).json({ message: 'Server configuration error: JWT_SECRET_PUBLIC is not defined' });
            }

            const decoded = jwt.verify(token, secret) as {email: string, name: string};
            await dbConnect();

            const UserToLogout = await fetchUser(decoded.email);
            if(UserToLogout?.session.accessToken === token){
                await User.updateOne({email: UserToLogout.email}, {$set: {session: {}}})
            }
            else{
                throw new Error("abuse of token detected: provided token does not correspond a user");
                
            }



            return res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.error("Logout error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed. Use POST." });
    }
}
