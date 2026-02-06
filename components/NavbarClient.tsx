"use client";
import { Brain } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import DailyQuestionButton from "./DailyQuestionButton";

export default function NavbarClient({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleBetterLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await signOut();
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <nav className="bg-[#1a1a1a]/80 border-b border-neutral-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-amber-500 flex items-center mr-8 gap-2 cursor-pointer"
          >
            <Brain size={24} /> Pulse
          </Link>
          <div className="flex items-center gap-1">
            {signedIn && (
              <div className="space-x-3">
                <Link
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname === "/dashboard"
                    ? "bg-[#333] text-white"
                    : "text-gray-400 hover:text-white"
                }
              `}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname === "/analytics"
                    ? "bg-[#333] text-white"
                    : "text-gray-400 hover:text-white"
                }
              `}
                  href="/analytics"
                >
                  Analytics
                </Link>
                <Link
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname === "/profile"
                    ? "bg-[#333] text-white"
                    : "text-gray-400 hover:text-white"
                }
              `}
                  href="/profile"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        </div>
        {signedIn && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center">
              <DailyQuestionButton />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBetterLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-red-400 hover:text-red-500 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:text-red-400"
                disabled={logoutLoading}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
        {!signedIn && (
          <div className="flex items-center gap-4">
            <Link
              className="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors
                bg-amber-500 text-neutral-900"
              href="/auth"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
