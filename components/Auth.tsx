"use client";
import { Brain } from "lucide-react";
import Link from "next/link";
import AuthForm from "./AuthForm";

export default function Auth() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-4 bg-neutral-800 rounded-full shadow-[0_0_50px_-12px_rgba(255,161,22,0.5)]">
        <Brain size={64} className="text-amber-500" />
      </div>
      <h1 className="text-5xl font-bold mb-8 tracking-tight text-white">
        LeetCode <span className="text-amber-500">Pulse</span>
      </h1>
      <AuthForm />
    </div>
  );
}
