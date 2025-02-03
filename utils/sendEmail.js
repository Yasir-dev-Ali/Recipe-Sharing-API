import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email app password
    },
});

const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: `"Recipe Sharing" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Click the link below to verify your email:</p>
               <a href="${verificationLink}" target="_blank">Verify Email</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendVerificationEmail;
