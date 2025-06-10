import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { automaticLogin } from "../actions/registration";

export async function decodeSession() {
  const token = sessionStorage.getItem("userInfo");

  if (token) {
    try {
      const decoded = jwtDecode(token);

      const expiresAt = new Date(decoded.verification_expires_at).getTime();
      const now = Date.now();

      // Calculate time left until expiration (in seconds)
      let diffSeconds = Math.floor((expiresAt - now) / 1000);

      // Clamp to 0 if expired
      if (diffSeconds < 0) {
        diffSeconds = 0;
      }

      return {
        decoded,
        timeLeft: diffSeconds,
      };
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  return null;
}

export async function verifyCode(code) {
  try {
    const session = await decodeSession();
    const email = session?.decoded?.email;

    if (!email) {
      throw new Error("No email found in session.");
    }

    const data = { email, code };

    const response = await axios.post(
      "http://127.0.0.1:8000/api/email/verify-code",
      data
    );
    sessionStorage.removeItem("userInfo");
    console.log("responseeein auto login", response)
    await automaticLogin(response.data)
    return { success: true, message: response.data.message };
  } catch (error) {
    const err = error?.response?.data?.message || "Something went wrong.";
    return { success: false, err };
  }
}
