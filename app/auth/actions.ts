"use server";

import { redirect } from "next/navigation";
import { signUp, signIn } from "@/lib/auth";

export async function actionSignUp(initialState: any, formData: FormData) {
  const rawFormData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  if (!rawFormData.username || !rawFormData.password) {
    return {
      message: "username and password required",
    };
  }

  const res = await signUp({
    username: rawFormData.username.toString(),
    password: rawFormData.password.toString(),
  });

  if (res.success) {
    redirect("/profile");
  }
  return {
    message: res.message,
  };
}

export async function actionSignIn(initialState: any, formData: FormData) {
  const rawFormData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  if (!rawFormData.username || !rawFormData.password) {
    return {
      message: "username and password required",
    };
  }

  const res = await signIn({
    username: rawFormData.username.toString(),
    password: rawFormData.password.toString(),
  });

  if (res.success) {
    redirect("/profile");
  }
  return {
    message: res.message,
  };
}
