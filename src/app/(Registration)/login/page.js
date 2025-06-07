"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginUser } from "../../../../actions/registration";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const [state, action, isPending] = useActionState(loginUser, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
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
