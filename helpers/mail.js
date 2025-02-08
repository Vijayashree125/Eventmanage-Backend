const nodeMailer = require("nodemailer")

// Configure Nodemailer with SMTP credentials
const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS  // Replace with your email password or App Password
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports.sendmail = async (email, otp) => {
    const mailOptions = {
        from: "shreejj862@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP for registration is: ${otp}`
    };
    console.log(mailOptions, 'mailoptions=============');


    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

