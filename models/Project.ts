import mongoose, { Schema } from "mongoose";

// Define a schema for the data structure
const projectSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});
const User = mongoose.models?.Project || mongoose.model('Project', projectSchema)
export default User