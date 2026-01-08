"use client";
import { Brain, UserIcon, Search, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleLogout } from "../app/profile/action";

export default function NavbarClient({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  console.log(signedIn);
  console.log(pathname);

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-neutral-700 px-6 py-4">
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
            )}
          </div>
        </div>
        {signedIn && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-[#282828] rounded-full px-4 py-2 border border-neutral-700">
              <Search size={16} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search problems..."
                className="bg-transparent border-none outline-none text-sm w-48 text-white placeholder-gray-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="w-9 h-9 rounded-full bg-[#3e3e3e] flex items-center justify-center text-gray-300 hover:bg-[#4e4e4e] transition-colors"
              >
                <UserIcon size={18} />
              </Link>
              <button
                onClick={handleLogout}
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
                  pathname === "/auth/sign-in"
                    ? "bg-[#333] text-white"
                    : "text-gray-400 hover:text-white"
                }
              `}
              href="/auth/sign-in"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
