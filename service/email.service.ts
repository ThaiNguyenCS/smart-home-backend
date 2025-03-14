import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export async function sendResetPasswordEmail(to: string, resetToken: string) {
    if (!to) {
        throw new Error("Recipient email is required");
    }
    const resetLink = `http://localhost:5000/changePassword?token=${resetToken}`

    const mailOptions = {
        from: `"Smart Home" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: "Reset Your Password",
        text: `Click here to reset your password: ${resetLink}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send reset password email");
    }
}
