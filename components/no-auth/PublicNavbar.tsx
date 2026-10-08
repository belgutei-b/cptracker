"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

import AppLogo from "@/components/AppLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/#analytics", label: "Analytics" },
  { href: "/#how", label: "How it works" },
  { href: "/extension", label: "Extension" },
];

/**
 * Navbar for public pages (landing, extension, legal, sign in)
 */
export default function PublicNavbar({ isSignedIn }: { isSignedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="landing-container flex h-16 items-center gap-8">
        <AppLogo className="text-base" />

        <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isSignedIn ? (
            <Button asChild size="lg">
              <Link href="/dashboard">
                Dashboard
                <ArrowRight />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="lg" className="hidden sm:inline-flex">
                <Link href="/auth">Sign in</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/auth">
                  Get started
                  <ArrowRight />
                </Link>
              </Button>
            </>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className={buttonVariants({ variant: "ghost", size: "icon-lg", className: "md:hidden" })}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent className="gap-1 px-3 pt-14">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Main" className="flex flex-col gap-1">
                {[...NAV_LINKS, { href: "/auth", label: "Sign in" }].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex h-11 items-center rounded-md px-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
