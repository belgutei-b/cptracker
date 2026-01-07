"use server";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { createSession } from "./session";

const saltRounds = 10;
const secretKey = process.env.SESSION_SECRET;

export async function signUp({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    // TODO: hash password
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash: hash,
      },
    });

    // setting jwt token | 7 days
    await createSession(user.id.toString());

    return {
      message: "Successfully signed-up",
      success: true,
    };
  } catch (err) {
    console.log(err);
    return {
      message: "Error signing-up",
      success: false,
    };
  }
}
