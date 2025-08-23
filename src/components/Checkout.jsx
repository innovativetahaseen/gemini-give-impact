// Example: src/components/Checkout.jsx
import React from "react";

function Checkout() {
  const handlePayment = async () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,  // 👈 from .env
      amount: 50000, // amount in paise (50000 = ₹500)
      currency: "INR",
      name: "My Project",
      description: "Test Transaction",
      handler: function (response) {
        alert("Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <button onClick={handlePayment} className="btn">
      Pay ₹500
    </button>
  );
}

export default Checkout;
