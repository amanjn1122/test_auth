import mongoose, { Schema } from "mongoose";

// Define a schema for the data structure
const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    session: {
        accessToken: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        }
    }
});

// Create the User model or use an existing one
const User = mongoose.models?.User || mongoose.model('User', userSchema);

export default User;
