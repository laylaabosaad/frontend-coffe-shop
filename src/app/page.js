// "use client"
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// import { useEffect } from "react";
export default function Home() {
  

// useEffect(() => {
//   const token = Cookies.get("authToken");

//  if (token) {
//   const decoded = jwtDecode(token);
//   const now = Date.now() / 1000;

//   const nowDate = new Date(now * 1000).toLocaleString();
//   const expiryDate = new Date(decoded.exp * 1000).toLocaleString();

//   if (decoded.exp < now) {
//     Cookies.remove("authToken");
//     console.log("Token expired at:", expiryDate);
//   } else {
//     console.log("Token still valid");
//     console.log("Current time:", nowDate);
//     console.log("Token expires at:", expiryDate);
//   }
// }

// }, []);

  return (
   <>hello</>
  );
}
