const nodemailer = require("nodemailer");
const EMAILBODY = require("../helpers/mail_body");

const sendMail = (email, employ_name) =>
  new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
      },
      secure: true,
      tls: {
        servername: "gmail.com",
      },
    });

    let mailOptions = {
      from: "replyus.app@gmail.com",
      to: `${email}`,
      subject: "Payroll System",
      html: EMAILBODY(employ_name,"imgs/logo_ios.png", "not-me-password-reset"),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      }
      resolve("ok");
    });
  });


module.exports = sendMail;
