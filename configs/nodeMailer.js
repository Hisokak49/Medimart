import nodemailer from 'nodemailer';

// Configure SMTP transport using Brevo credentials from environment variables
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends a transactional email using Brevo.
 * @param {Object} params - The email details.
 * @param {string} params.to - Recipient email.
 * @param {string} params.subject - Email subject.
 * @param {string} params.body - Email HTML body.
 */
const sendEmail = async ({ to, subject, body }) => {
    try {
        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: body,
        });
        return response;
    } catch (error) {
        console.error("Failed to send email via Brevo:", error.message);
        throw error;
    }
}

export default sendEmail;
