import { z } from "zod";

export const RegisterFormSchema = z
  .object({
    email: z.string().email({ message: "Please Enter a Valid Email" }).trim(),
    password: z
      .string()
      .min(1, { message: "Not be empty" })
      .min(5, { message: "Be atleast 5 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contains at least 1 letter" })
      .regex(/[0-9]/, { message: "Contains at least 1 number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contains at least 1 special character",
      })
      .trim(),
    password_confirmation: z.string().trim(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password fields do not match",
        path: ["password_confirmation"],
      });
    }
  });

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please Enter a Valid Email" }).trim(),
  password: z.string().min(1, { message: "Password is Required" }).trim(),
});

export const BlogPostSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title Field is Required." })
    .max(100, { message: "Title can't be more than 100 characters" })
    .trim(),
  content: z.string().min(1, { message: "Content Field is Required." }).trim(),
});
