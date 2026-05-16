import Logo from "@/components/no-auth/Logo";
import Link from "next/link";
import type { LegalPageContent } from "./legal-content";

type LegalPageProps = {
  content: LegalPageContent;
};

export default function LegalPage({ content }: LegalPageProps) {
  return (
    <main className="min-h-dvh text-white">
      <div className="mx-auto max-w-3xl px-6 py-8 md:py-12">
        <header className="mb-16">
          <div className="mb-12 flex items-center justify-between gap-4">
            <Logo className="mb-0! w-auto" />
            <nav className="flex items-center gap-4 text-sm text-stone-400">
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
            </nav>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 text-base font-medium leading-8 text-stone-300">
            {content.description}
          </p>
          <p className="mt-5 text-sm text-stone-300 italic">
            Last modified:{" "}
            <time dateTime={toDateTime(content.lastModified)}>
              {content.lastModified}
            </time>
          </p>
        </header>

        <div>
          {content.sections.map((section, index) => (
            <section
              key={section.title}
              className="border-t border-white/10 py-8"
            >
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
                {String(index + 1).padStart(2, "0")}. {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-stone-300 font-medium"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="border-t border-white/10 py-8 text-sm text-stone-300 font-medium">
          <p>
            These pages are provided for CPTracker users. For privacy questions
            or data deletion requests, use the support contact made available on
            cptracker.org.
          </p>
        </footer>
      </div>
    </main>
  );
}

function toDateTime(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? undefined
    : parsed.toISOString().slice(0, 10);
}
