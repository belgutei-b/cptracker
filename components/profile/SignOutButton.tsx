"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSignOut = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await signOut();
      localStorage.removeItem("tz");
      router.replace("/auth");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={isLoading}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-red-400 hover:text-red-500 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:text-red-400 border border-[#3e3e3e]"
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}
