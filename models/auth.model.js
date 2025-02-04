import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },


    password: {
        type: String,
        required: true
    },
    isVerified: {
         type: Boolean,
          default: false
         },
    verificationToken: {
        type: String,
        required: false
    },
    followers: [{ 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User"
         }],
    following: [{ 
        type: mongoose.Schema.Types.ObjectId,

         ref: "User" }],

         profile: {
            fullName: { type: String },
            bio: { type: String },
            avatar: { type: String }, // Profile picture URL
        },
        resetPasswordToken: { type: String }, // Token for password reset

emailToken: { type: String }, // Store verification token
},{timestamps: true});

const Auth = mongoose.model("Auth", authSchema);

export default Auth;