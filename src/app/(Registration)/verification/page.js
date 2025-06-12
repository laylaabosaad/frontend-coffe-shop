"use client";

import { useRef, useState, useEffect } from "react";
import { decodeSession, fetchToken } from "../../../../lib/session";
import { verifyCode } from "../../../../lib/session";
import {
  resendVerificationCode,
} from "../../../../actions/registration";

function Verification() {
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resendingCode, setResendingCode] = useState("");
  const [token, setToken] = useState(null);
  const [loadingResend, setLoadingResend]= useState(false)

  useEffect(() => {
    let intervalId;
    const storedToken = sessionStorage.getItem("userInfo");
  if (storedToken) {
    setToken(storedToken);
  }
    async function initCountdown() {
      const sessionData = await decodeSession();
      console.log("sessionData", sessionData.decoded.email);
      setEmail(sessionData.decoded.email);
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
  }, [token]);

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
    setResendingCode("")

    const code = inputsRef.current.map((input) => input.value).join("");

    if (code.length === 5) {
      setLoading(true);
      const result = await verifyCode(code);
      console.log("result after submit", result);

      if (!result?.success) {
        setErrorMessage(result.err);
       
      } else {
        setErrorMessage("");
      }
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoadingResend(true)
      const response = await resendVerificationCode(token);
      console.log("responseeeee", response.message);
      const newToken = sessionStorage.setItem("userInfo", response.token);
      setToken(newToken);
      setResendingCode(response.message);
      setLoadingResend(false)
    } catch {}
  };

  return (
    <div className="w-full flex justify-center items-start mt-[100px] min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 p-8 bg-white shadow-lg rounded-xl max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Enter Verification Code
        </h2>

        <p className="text-gray-600 text-sm text-center -mt-3">
          A verification code has been sent to{" "}
          <span className="font-medium">{email}</span>. Please enter the 5-digit
          code below to continue.
        </p>

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

        {resendingCode && (
          <p className="text-[green] text-sm -mt-4">{resendingCode}</p>
        )}

        <button
          type="submit"
          disabled={!allowSubmit || loading}
          className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Submit"}
        </button>

        {timeLeft !== null && (
          <div className="text-gray-600 text-sm flex flex-col items-center gap-1">
            <p>
              Resend available in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")} minutes
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={handleResendCode}
          disabled={timeLeft > 0 || loadingResend}
          className="text-blue-600  cursor-pointer disabled:text-gray-400"
        >
         {loadingResend?"Resending...":"Resend Code"}
        </button>
      </form>
    </div>
  );
}

export default Verification;
