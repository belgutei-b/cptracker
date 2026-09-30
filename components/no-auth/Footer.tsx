import Link from "next/link";

import AppLogo from "@/components/AppLogo";
import { EXTENSION_STORE_URL } from "@/constants/links";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "/auth", label: "Sign in" },
      { href: "/#analytics", label: "Analytics" },
      { href: "/upcoming", label: "Roadmap" },
    ],
  },
  {
    title: "Extension",
    links: [
      { href: "/extension", label: "Overview" },
      { href: EXTENSION_STORE_URL, label: "Chrome Web Store" },
      { href: "/extension/privacy-policy", label: "Privacy details" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-[#090b0c]">
      <div className="landing-container grid gap-10 pt-14 pb-10 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] md:pt-16">
        <div className="flex flex-col items-start gap-4">
          <AppLogo className="text-base" />
          <p className="max-w-[300px] text-sm leading-relaxed text-muted-foreground">
            Time your LeetCode practice and see your solve time by difficulty
            and topic.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:contents">
          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title} className="flex flex-col gap-3 text-sm">
              <h2 className="font-semibold">{section.title}</h2>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-1 border-t pt-6 text-[13px] text-muted-foreground sm:flex-row sm:justify-between md:col-span-full">
          <span>© {new Date().getFullYear()} CPTracker</span>
          <span>MIT licensed · Built for LeetCode practice</span>
        </div>
      </div>
    </footer>
  );
}
