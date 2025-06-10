
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function getUserAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  return null;
}

