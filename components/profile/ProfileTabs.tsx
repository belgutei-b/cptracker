import Link from "next/link";
import { cn } from "@/lib/utils";

// tabs live in the query string so /profile stays a single protected route
const PROFILE_TABS = [
  { id: "overview", label: "Overview", href: "/profile" },
  { id: "sessions", label: "Sessions", href: "/profile?tab=sessions" },
  { id: "settings", label: "Settings", href: "/profile?tab=settings" },
] as const;

export type ProfileTab = (typeof PROFILE_TABS)[number]["id"];

export function parseProfileTab(value: string | undefined): ProfileTab {
  return PROFILE_TABS.find((tab) => tab.id === value)?.id ?? "overview";
}

export default function ProfileTabs({ active }: { active: ProfileTab }) {
  return (
    <nav aria-label="Profile sections" className="flex gap-6 border-b">
      {PROFILE_TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
              isActive
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
