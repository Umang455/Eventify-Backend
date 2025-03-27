let nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    // 'email-smtp.us-east-2.amazonaws.com',
    service: "gmail",
    host: "smtp.gmail.com",
    // port: 587,
    // ignoreTLS: false,
    auth: {
        user: "umang.duss@gmail.com",
        pass: "ckfreqcziopbjltc",
    },

    // host: 'smtp.gmail.com',
    // port: 587,
    // // tls: 465,
    // ignoreTLS: false,
    // auth: {
    //     user: process.env.SENDER_EMAIL_ADDRESS,
    //     pass: process.env.SENDER_EMAIL_PASSWORD,
    // }
});

module.exports = { transporter };