"use server";

import axios from "axios";
import { LoginFormSchema, RegisterFormSchema } from "../lib/rules";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(prevState, formData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate inputs locally first
  const parsed = LoginFormSchema.safeParse(rawData);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      errors,
      email: rawData.email,
    };
  }
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/login", rawData);
    console.log("res.data.token", res.data.token);
    if (res.data.token) {
      const cookieStore = cookies();
      cookieStore.set("authToken", res.data.token, {
        httpOnly: true,
        path: "/",
        maxAge: res.data.expires_in, // or use a number like 3600 (seconds)
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    let errors = {};
    if (error.response?.data?.errors) {
      // Use backend validation or login errors
      errors = error.response.data.errors;
    } else if (error.response?.data?.message) {
      errors.general = [error.response.data.message];
    } else {
      errors.general = ["Login failed. Please try again."];
    }
    return {
      success: false,
      errors,
      email: rawData.email,
    };
  }
}

export async function registerUser(state, formData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };
  console.log("dataaa", data);
  const parsed = RegisterFormSchema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    console.log("errors", errors);
    return {
      success: false,
      errors,
      email: data.email,
      name: data.name,
    };
  }

  try {
    await axios.post("http://127.0.0.1:8000/api/register", data);

    return {
      success: true,
      email: data.email,
    };
  } catch (error) {
    let errors = {};
    if (error.response?.data?.errors) {
      errors = error.response.data.errors;
    } else if (error.response?.data?.message) {
      errors.general = [error.response.data.message];
    } else {
      errors.general = ["Registration failed. Please try again."];
    }
    return {
      success: false,
      errors,
      email: data.email,
      name: data.name,
    };
  }
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete("authToken");
  redirect("/");
}
