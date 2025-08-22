const nodemailer = require("nodemailer");
require("dotenv").config();


exports.handler = async (event, context) => {
  try {
    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail from Netlify
        pass: process.env.EMAIL_PASS  // App Password from Netlify
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "tahaseenk56@gmail.com", // 👈 change this to your real email
      subject: "Test email from Netlify",
      text: "Hello! This is a test email sent from my Netlify function 🎉"
    });

    return {
      statusCode: 200,
      body: "✅ Email sent successfully!"
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: `❌ Error: ${error.message}`
    };
  }
};
