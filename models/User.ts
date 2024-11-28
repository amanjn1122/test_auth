import mongoose, { Schema } from "mongoose";

/* name : Encrypted full name of user (Required)
   email: Encoded email of user (Required)
   audit: Array of time objects by user for a quiz. (Optional)
          time: {
            quizId: 'ObjectId of Quiz' (Required)
            timeTaken: 'Integer in milliseconds denoting time taken to complete the quiz'
            score: 'Overall score of user's corresponding to quizId'
            attempted: Responses of user
          }
*/

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
    }
});
const User = mongoose.models?.User || mongoose.model('User', userSchema)
export default User