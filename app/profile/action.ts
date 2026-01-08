"use server";
import { redirect } from "next/navigation";
import { deleteSession } from "../../lib/session";

export async function handleLogout() {
  await deleteSession();
  redirect("/auth/sign-in");
}
