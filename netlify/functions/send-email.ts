import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

const handler: Handler = async (event) => {
  try {
    let donorName = "Test User";
    let donorEmail = "";
    let donorMessage = "This is a test email from Netlify! 🎉";

    // If request has body, extract donor info
    if (event.body) {
      const body = JSON.parse(event.body);
      if (body.name) donorName = body.name;
      if (body.email) donorEmail = body.email;
      if (body.message) donorMessage = body.message;
    }

    // Configure transporter with Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email (to donor if provided, else to yourself)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: donorEmail || process.env.EMAIL_USER,
      replyTo: donorEmail || undefined,
      subject: donorEmail
        ? "🙏 Thank you for your donation!"
        : "✅ Test email from Netlify",
      text: donorEmail
        ? `Hi ${donorName},\n\nThank you for your kind donation. ${donorMessage}\n\n- The Team`
        : "This is a test email to confirm your Netlify function works.",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent successfully" }),
    };
  } catch (error: any) {
    console.error("Email error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

export { handler };
