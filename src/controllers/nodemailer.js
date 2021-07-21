
const nodemailer = require('nodemailer'); // email sender function 

var transporter = nodemailer.createTransport({

    host: 'mail.fondolaraza.com',
    port: 465,
    secure: true,
    auth: {
        user: "noreply@fondolaraza.com",
        pass: "mailFondo2020noreply"
    }
});


module.exports= transporter;