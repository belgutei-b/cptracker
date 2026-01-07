"use server";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { createSession } from "./session";

const saltRounds = 10;

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

export async function signIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!user || !user.passwordHash) {
      throw new Error("user not found");
    }
    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new Error("invalid password");
    }

    await createSession(user.id.toString());
    return {
      message: "Successfully signed-up",
      success: true,
    };
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return {
        message: err.message,
      };
    }
    return {
      message: "Error signing-in",
    };
  }
}
