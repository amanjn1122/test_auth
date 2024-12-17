import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import jwt from 'jsonwebtoken';

interface Session {
    accessToken: string;
    refreshToken: string;
}

interface UserInfo{
    name: string;
    email: string;
    password?: string;  // Optional because you may not want to expose this in some cases
    session: Session;
}

await dbConnect()

export const fetchUser = async (email: string) => {
    return await User.findOne({email: email}) as UserInfo
}

export const createUser = async (user: UserInfo) => {
    try{
        await User.create({ email: user.email, name: user.name, session: user.session });
        return;
    }
    catch(error){
        throw new Error("error in creating new user");
    }
    
}

export const updateUser = async (user: UserInfo) => {
    try{
        await User.findOneAndUpdate({ email: user.email }, user);
        return;
    }
    catch(error){
        throw new Error("error in updating user");
    }
    
}

export const generateAccessToken = (user: any) => {
    const jwtSecret = process.env.JWT_SECRET; 
    if (!jwtSecret) { 
        throw new Error("Server configuration error: JWT_SECRET is not defined in env");
    }
    const accessToken = jwt.sign({ email: user.email, name: user.name }, jwtSecret, { expiresIn: '1h', algorithm: 'RS256' }); // Access token with a shorter lifespan 

    return accessToken;

}

export const generateRefreshToken = (user: UserInfo) => {
    const jwtSecret = process.env.JWT_SECRET_REFRESH_TOKEN; 
    if (!jwtSecret) { 
        throw new Error("Server configuration error: JWT_SECRET_REFRESH_TOKEN is not defined in env");
    }
    const token = jwt.sign({ email: user.email, name: user.name }, jwtSecret, { expiresIn: '7d', algorithm: 'RS256' }); // Ref-resh token with a longer lifespan 

    return token;
}
