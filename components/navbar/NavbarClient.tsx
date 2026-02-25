"use client";
import DailyQuestionButton from "@/components/navbar/DailyQuestionButton";
import { Brain, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavbarClient({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  const navItemClass = (isActive: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-[#333] text-white" : "text-gray-400 hover:text-white"
    }`;
  const logoHref = signedIn ? "/dashboard" : "/";

  return (
    <>
      {/* desktop navbar */}
      <nav className="hidden md:block bg-[#1a1a1a]/80 border-b border-neutral-700 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            href={logoHref}
            className="text-xl font-bold text-amber-500 flex items-center gap-2 cursor-pointer"
          >
            <Brain size={24} /> CPTracker
          </Link>
          {signedIn && (
            <div className="flex w-full justify-between">
              {/* left side */}
              <div className="flex items-center gap-3">
                <Link
                  className={navItemClass(pathname === "/dashboard")}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className={navItemClass(pathname === "/analytics")}
                  href="/analytics"
                >
                  Analytics
                </Link>
              </div>

              {/* right side */}
              <div className="flex">
                <DailyQuestionButton />
                <Link
                  className={navItemClass(pathname === "/profile")}
                  href="/profile"
                >
                  Profile
                </Link>
              </div>
            </div>
          )}
          {!signedIn && (
            <div className="flex flex-row-reverse w-full">
              <Link
                className="inline-flex px-4 py-2 rounded-lg text-sm font-semibold border transition-colors bg-amber-500 text-neutral-900"
                href="/auth"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* mobile navbar */}
      <nav className="md:hidden bg-[#1a1a1a]/80 border-b border-neutral-700 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={logoHref}
            onClick={closeMobileMenu}
            className="text-xl font-bold text-amber-500 flex items-center gap-2 cursor-pointer"
          >
            <Brain size={24} /> CPTracker
          </Link>
          <button
            type="button"
            aria-label={
              mobileOpen ? "Close mobile navigation" : "Open mobile navigation"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navbar"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-700 p-2 text-gray-200 transition-colors hover:bg-[#333]"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <div
          id="mobile-navbar"
          aria-hidden={!mobileOpen}
          className={`grid transition-all duration-300 ease-out ${
            mobileOpen
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-neutral-700 pt-4">
              {signedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    className={navItemClass(pathname === "/dashboard")}
                    href="/dashboard"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    className={navItemClass(pathname === "/analytics")}
                    href="/analytics"
                    onClick={closeMobileMenu}
                  >
                    Analytics
                  </Link>
                  <DailyQuestionButton />
                  <Link
                    className={navItemClass(pathname === "/profile")}
                    href="/profile"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <Link
                  className="inline-flex w-full items-center justify-center rounded-lg border bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors"
                  href="/auth"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
