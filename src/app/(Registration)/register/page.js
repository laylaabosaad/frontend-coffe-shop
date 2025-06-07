"use client";
import Link from "next/link";
import React, { useActionState, useEffect, useState } from "react";
import { registerUser } from "../../../../actions/registration";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function register() {
  const [state, action, isPending] = useActionState(registerUser, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      sessionStorage.setItem("userEmail", state?.email);
      router.push("/verification");
    }
  }, [state?.success, router]);

  return (
    <div className="w-[100%] flex mt-[5%] justify-center items-center">
      <div className="w-1/2 ">
        <div className=" text-center">
          <h1 className="title">Register</h1>
        </div>
        <form action={action} className="  space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={state?.name} />
          </div>
          {state?.errors?.name && <p className="error">{state.errors.name}</p>}
          <div>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" defaultValue={state?.email} />
          </div>
          {state?.errors?.email && (
            <p className="error">{state.errors.email}</p>
          )}
          <div>
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                defaultValue={state?.password}
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
          </div>
          {state?.errors?.password && (
            <ul className="error flex flex-col p-2 text-red-600">
              {Array.isArray(state.errors.password) ? (
                state.errors.password.map((err, index) => (
                  <li key={index}>• {err}</li>
                ))
              ) : (
                <li>• {state.errors.password}</li>
              )}
            </ul>
          )}

          <div>
            <label htmlFor="password_confirmation">Confirm Password</label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                id="password_confirmation"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )}
              </button>
            </div>
          </div>
          {state?.errors?.password_confirmation && (
            <p className="error">{state.errors.password_confirmation}</p>
          )}
          <div className="flex items-end gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary cursor-pointer"
            >
              {isPending ? "Loading..." : "Register"}
            </button>
          </div>
          <Link href="/login" className="text-link">
            Or Login Here
          </Link>
        </form>
      </div>
    </div>
  );
}

export default register;
