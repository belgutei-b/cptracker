"use client";
import Link from "next/link";

export default function AuthForm() {
  return (
    <form
      // onSubmit={handleAuth}
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
            type="password"
            placeholder="Password"
            className="auth-input"
          />
        </div>
        <button className="auth-button">Sign Up</button>
      </div>
      <div className="flex justify-center mt-8">
        <p className="text-gray-400 mr-3">Have an account?</p>
        <Link href="/auth/sign-in">Sign In</Link>
      </div>

      <div className="text-small text-gray-400 mt-8">
        or you can sign in with
      </div>
      {/* TODO: google logo */}
    </form>
  );
}
