"use client";

import { useRef, useState, useEffect } from "react";
import { decodeSession } from "../../../../lib/session";
import { verifyCode } from "../../../../lib/session";
import { loginUser } from "../../../../actions/registration";

function Verification() {
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let intervalId;
    async function initCountdown() {
      const sessionData = await decodeSession();
      if (sessionData?.timeLeft) {
        setTimeLeft(sessionData.timeLeft);

        intervalId = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(intervalId);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    initCountdown();

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) {
      e.target.value = "";
      return;
    }

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!value && e.nativeEvent.inputType === "deleteContentBackward") {
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    const allFilled = inputsRef.current.every((input) => input?.value);
    setAllowSubmit(allFilled);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const code = inputsRef.current.map((input) => input.value).join("");

    if (code.length === 5) {
      
      const result = await verifyCode(code);
      console.log("result after submit", result);
      if (!result?.success) {
        setErrorMessage(result.err);
      } 
    }
  };

  const handleResendCode = async () => {
    console.log("Resending code...");
    // Add logic to resend code and reset timer
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-2">Enter Verification Code</h2>

        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              autoFocus={index === 0}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {errorMessage && (
          <p className="text-red-600 text-sm -mt-4">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="text-green-600 text-sm -mt-4">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={!allowSubmit}
          className="btn-primary disabled:bg-gray-400 cursor-pointer"
        >
          Submit
        </button>

        {timeLeft !== null && (
          <div className="text-gray-600 flex justify-center flex-col items-center">
            <p>
              Resend available in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")} minutes
            </p>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={timeLeft > 0}
              className="text-blue-700 text-[15px] disabled:text-gray-400"
            >
              Resend Code
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Verification;
