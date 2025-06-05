"use client";

import { useRef, useState, useEffect } from "react";

function Verification() {
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      setResendEnabled(true);
      // Optionally auto-resend here or let user click "Resend"
      resendVerificationEmail();
      return; // stop timer
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft]);

  const resendVerificationEmail = () => {
    console.log("Resend verification email triggered.");
    // Reset timer & resend button state
    setTimeLeft(60);
    setResendEnabled(false);
    // Add your email resend API call here
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const allFilled = inputsRef.current.every((input) => input?.value);
    if (allFilled) {
      console.log("Auto-submit or verification logic here");
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
      <form className="flex flex-col items-center gap-6 p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold">Enter Verification Code</h2>

        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <div className="mt-4 text-gray-600">
          <p>
            Resend available in {timeLeft} second{timeLeft !== 1 ? "s" : ""}
          </p>
        </div>
      </form>
    </div>
  );
}

export default Verification;
