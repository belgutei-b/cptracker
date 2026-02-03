"use client";
import { Brain, UserIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import DailyQuestionButton from "./DailyQuestionButton";

export default function NavbarClient({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleBetterLogout = async () => {
    await signOut();
    router.refresh();
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
              <Link
                href="/profile"
                className="w-9 h-9 rounded-full bg-[#3e3e3e] flex items-center justify-center text-gray-300 hover:bg-[#4e4e4e] transition-colors"
              >
                <UserIcon size={18} />
              </Link>
              <button
                onClick={handleBetterLogout}
                className="w-9 h-9 rounded-full bg-[#3e3e3e] flex items-center justify-center text-red-400 hover:bg-red-900/30 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
        {!signedIn && (
          <div className="flex items-center gap-4">
            <Link
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  pathname === "/auth"
                    ? "bg-[#333] text-white"
                    : "text-gray-400 hover:text-white"
                }
              `}
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
