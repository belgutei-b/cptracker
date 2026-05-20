import Link from "next/link";

const footerSections = [
  {
    title: "CPTracker",
    links: [
      { href: "/", label: "Home" },
      { href: "/auth", label: "Sign in" },
    ],
  },
  {
    title: "Extension",
    links: [
      { href: "/extension", label: "Overview" },
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
    <footer className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-8 border-t border-white/10 px-6 py-8 text-sm sm:grid-cols-3">
        {footerSections.map((section) => (
          <nav key={section.title} aria-label={section.title}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-200">
              {section.title}
            </h2>

            <ul className="mt-4 space-y-3 text-stone-400 font-medium">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-medium transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <p className="text-stone-500 sm:col-span-3">
          © {new Date().getFullYear()} CPTracker
        </p>
      </div>
    </footer>
  );
}
