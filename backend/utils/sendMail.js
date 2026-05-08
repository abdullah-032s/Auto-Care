const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            auth:{
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: "abdullahawais034@gmail.com", // overriding as requested
            subject: options.subject,
            text: options.message,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.warn("Mail sending failed (SMTP config issue), but proceeding gracefully:", error.message);
    }
};

module.exports = sendMail;