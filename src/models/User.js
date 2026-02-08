import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // uid: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['seeker', 'provider', 'admin'],
        default: 'seeker'
    },
    photoURL: String
})

export default userSchema