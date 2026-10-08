"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, User } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AppLogo from "@/components/AppLogo";
import DailyQuestionButton from "@/components/navbar/DailyQuestionButton";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/extension-auth", label: "Extension" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Navbar for authenticated users
 */
export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-7 px-4 md:px-12">
        <AppLogo href="/dashboard" />

        {/* desktop */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={isActivePath(pathname, item.href)}
            />
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2.5 md:flex">
          <DailyQuestionButton />
          <ProfileLink active={isActivePath(pathname, "/profile")} />
        </div>

        {/* mobile */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <DailyQuestionButton iconOnly />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className={buttonVariants({ variant: "ghost", size: "icon-lg" })}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent className="gap-1 px-3 pt-14">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Main" className="flex flex-col gap-1">
                {[...NAV_ITEMS, { href: "/profile", label: "Profile" }].map(
                  (item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      active={isActivePath(pathname, item.href)}
                      onClick={() => setMobileOpen(false)}
                      className="h-11 text-base"
                    />
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {label}
    </Link>
  );
}

function ProfileLink({ active }: { active: boolean }) {
  return (
    <Link
      href="/profile"
      aria-label="Profile"
      aria-current={active ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: "outline", size: "icon-lg" }),
        "rounded-full text-foreground/75",
        active && "border-primary dark:border-primary",
      )}
    >
      <User />
    </Link>
  );
}
