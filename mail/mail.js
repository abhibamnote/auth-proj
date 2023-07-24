const nodemailer = require('nodemailer');
require('dotenv').config();



const sendEmail = async (otp, email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.Email_Host,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
            user: process.env.Email_ID, // generated ethereal user
            pass: process.env.Email_Pass, // generated ethereal password
            },
        });

        await transporter.sendMail({
            from: process.env.Email_ID,
            to: email,
            subject: "subject",
            text: `OTP:- ${otp}`,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};


module.exports = sendEmail;