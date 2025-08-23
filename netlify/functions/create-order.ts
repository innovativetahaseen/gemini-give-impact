import { Handler } from "@netlify/functions";
import Razorpay from "razorpay";

// Load .env only in local dev
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const { amount } = JSON.parse(event.body || "{}");

    if (!amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Amount is required" }),
      };
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount, // in paise (e.g. 50000 = ₹500)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, order }),
    };
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

export { handler };
