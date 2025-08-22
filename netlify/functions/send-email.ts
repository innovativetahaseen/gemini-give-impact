import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event) => {
  try {
    let name = "Test User";
    let email = process.env.EMAIL_USER; // default: send to yourself
    let message = "This is a test email from Netlify! 🎉";

    // If body exists, override with donor data
    if (event.body) {
      const body = JSON.parse(event.body);
      if (body.name) name = body.name;
      if (body.email) email = body.email;
      if (body.message) message = body.message;
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,                // if no body, goes to yourself
      replyTo: event.body ? email : undefined, // if donor, allow replies
      subject: event.body
        ? "🙏 Thank you for your donation!"
        : "✅ Test email from Netlify",
      text: event.body
        ? `Hi ${name},\n\nThank you for your kind donation. ${message}\n\n- The Team`
        : "This is a test email to confirm your Netlify function works.",
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
