"use client";
import { Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DailyQuestionButton from "./DailyQuestionButton";

export default function NavbarClient({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="bg-[#1a1a1a]/80 border-b border-neutral-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-amber-500 flex items-center mr-8 gap-2 cursor-pointer"
          >
            <Brain size={24} /> CPTracker
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
              </div>
            )}
          </div>
        </div>
        {signedIn && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center">
              <DailyQuestionButton />
            </div>
            <Link
              href="/profile"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/profile"
                  ? "bg-[#333] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Profile
            </Link>
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
