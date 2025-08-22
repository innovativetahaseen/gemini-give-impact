import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event) => {
  try {
    const { name, email, message } = JSON.parse(event.body || "{}");

    // Configure your SMTP transporter (use Gmail, Outlook, or any SMTP service)
    const transporter = nodemailer.createTransport({
      service: "gmail", // change if you use Outlook/Zoho/etc.
      auth: {
        user: process.env.EMAIL_USER, // stored in Netlify environment variable
        pass: process.env.EMAIL_PASS, // stored in Netlify environment variable
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, // donor’s email
      subject: "🙏 Thank you for your donation!",
      text: `Hi ${name},\n\nThank you for your kind donation. ${message}\n\n- The Team`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent successfully" }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

export { handler };
