import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        });

        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
    
    const link = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
    const html = `<p>Click the link to verify your email:</p>
                  <a href="${link}">Verify Email</a>`;
    await sendEmail(email, "Verify Your Email", html);
};

export default sendEmail;
export { sendVerificationEmail };
