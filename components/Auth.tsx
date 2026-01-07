"use client";
import Link from "next/link";
import { Brain } from "lucide-react";
import { useActionState } from "react";
import { actionSignUp } from "@/app/auth/sign-up/actions";

const initialState = {
  message: "",
};

export default function Auth({ isSignUp }: { isSignUp: boolean }) {
  const [state, formAction, pending] = useActionState(
    actionSignUp,
    initialState
  );

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-4 bg-neutral-800 rounded-full shadow-[0_0_50px_-12px_rgba(255,161,22,0.5)]">
        <Brain size={64} className="text-amber-500" />
      </div>
      <h1 className="text-5xl font-bold mb-8 tracking-tight text-white">
        LeetCode <span className="text-amber-500">Pulse</span>
      </h1>
      <form
        action={formAction}
        className="bg-neutral-800 p-8 rounded-2xl border border-neutral-600 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-xl font-semibold mb-6 text-white">
          Start Tracking Now
        </h2>
        <div className="space-y-4">
          <div>
            <input
              name="username"
              required
              type="text"
              placeholder="Username"
              className="auth-input"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="auth-input"
            />
          </div>
          <p>{state?.message}</p>
          <button disabled={pending} type="submit" className="auth-button">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </div>
        <div className="flex justify-center mt-8">
          <p className="text-gray-400 mr-3">Have an account?</p>
          <Link href="/auth/sign-in">Sign In</Link>
        </div>

        <div className="text-small text-gray-400 mt-8">
          or you can {isSignUp ? "sign up" : "sign in"} with
        </div>
        {/* TODO: google logo */}
      </form>
    </div>
  );
}
