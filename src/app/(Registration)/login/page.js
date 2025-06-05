"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginUser } from "../../../../actions/registration";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

function Login() {
  const [state, action, isPending] = useActionState(loginUser, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      const tokenSaved = state?.token;
      const expiryDate = state?.expiresIn / (60 * 60 * 24);
      if (tokenSaved) {
        Cookies.set("authToken", tokenSaved, {
          expires: expiryDate,
          secure: true,
          sameSite: "Lax",
        });
      }
      router.push("/");
    }
  }, [state?.success, router]);
  

  return (
    <div className="w-full flex mt-[5%] justify-center items-center">
      <div className="w-1/2">
        <div className="text-center">
          <h1 className="title">Login</h1>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" defaultValue={state?.email} />
            {state?.errors?.email && (
              <p className="error">{state.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
            {state?.errors?.password && (
              <p className="error">{state.errors.password}</p>
            )}
          </div>

          {state?.errors?.general && (
            <p className="error">{state.errors.general}</p>
          )}

          <div className="flex items-end gap-4">
            <button
              type="submit"
              className="btn-primary cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </div>

          <Link href="/register" className="text-link">
            Or Register Here
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
