import Auth from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../utils/sendEmail.js";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { token } from "morgan";

// Register User with Email Verification
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
        let user = await Auth.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const emailToken = uuidv4(); // Generate unique token

        user = new Auth({ username, email, password: hashedPassword, emailToken });

        await user.save();

        // Send verification email
        await sendVerificationEmail(email, emailToken);

        res.status(201).json({ message: "User registered successfully! Please verify your email.",token:emailToken,token });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await Auth.findOne({ emailToken: token });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.isVerified = true;
        user.emailToken = null; // Remove token after verification
        await user.save();

        res.json({ message: "Email verified successfully! You can now log in." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// User Profile



// Login User (Only verified users can log in)
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Auth.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (!user.isVerified) return res.status(401).json({ message: "Email not verified. Check your email." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Forgot Password - Sends reset link
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = uuidv4();
        user.resetPasswordToken = resetToken;
        await user.save();

        const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${resetToken}`;

        await sendEmail(email, "Reset Your Password", `<p>Click the link to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>`);

        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await Auth.findOne({ resetPasswordToken: token });
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = null; // Remove token after reset
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


export  { register, verifyEmail, login, forgotPassword, resetPassword };