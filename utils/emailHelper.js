//"use strict";
const nodemailer = require("nodemailer");

const mailHelper= async(option)=>{
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      });

      const message={
            from: 'nishantap.a20@gmail.com', // sender address
            to: option.email, // list of receivers
            subject: option.subject, // Subject line
            text: option.message, // plain text body
            html: "<b>Hello world?</b>", // html body  
      }
      await transporter.sendMail(message);
}


module.exports = mailHelper;

