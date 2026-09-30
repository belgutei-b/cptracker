import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  Info,
  LayoutDashboard,
  MousePointerClick,
  NotebookPen,
  Puzzle,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ExtensionSteps from "@/components/extension/ExtensionSteps";
import { EXTENSION_STORE_URL } from "@/constants/extension";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "One click to add",
    body: "Open the panel on a problem and it’s added to your tracker. No copying links.",
  },
  {
    icon: Timer,
    title: "Real solve times",
    body: "The timer runs while you code, so your dashboard shows how long problems actually take.",
  },
  {
    icon: NotebookPen,
    title: "Notes in place",
    body: "Write your approach while it’s fresh. Markdown works, and notes are saved with the problem.",
  },
  {
    icon: LayoutDashboard,
    title: "Synced to your dashboard",
    body: "Mark it Tried or Solved and the result, time and notes show up on your dashboard and profile.",
  },
];

// answers follow the extension privacy policy
const FAQS = [
  {
    question: "Do I need a CPTracker account?",
    answer:
      "Yes. Sign in on cptracker.org first. The extension uses that sign-in, so it never asks for a password.",
  },
  {
    question: "What does it read from my browser?",
    answer:
      "Only the address of the current tab, to check that you’re on a LeetCode problem.",
  },
  {
    question: "Where does my data go?",
    answer: "To your CPTracker account. It isn’t sold or used for ads.",
  },
];

/**
 * Why and how to use the Chrome extension.
 * Shared by /extension (signed out) and /extension-auth (signed in).
 */
export default function ExtensionBody({ isAuth }: { isAuth: boolean }) {
  const privacyHref = isAuth
    ? "/extension-auth/privacy-policy"
    : "/extension/privacy-policy";

  return (
    <div className="flex flex-col">
      <Hero privacyHref={privacyHref} />

      <Section eyebrow="Why use it" title="Less tab switching. More honest numbers.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="flex flex-col gap-3.5 rounded-xl border bg-card p-5.5">
              <span className="flex size-9.5 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4.5" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="Three steps, all on the problem page."
        aside={
          <div className="flex gap-3 rounded-lg border bg-card px-4 py-3.5 text-sm leading-relaxed text-muted-foreground lg:max-w-[480px]">
            <Info className="mt-0.5 size-4 shrink-0 text-foreground" />
            <p>
              <span className="font-medium text-foreground">Before you start:</span>{" "}
              add the extension, then sign in on cptracker.org in the same
              Chrome profile. The extension uses that sign-in and never asks for
              a password.
            </p>
          </div>
        }
      >
        <ExtensionSteps />
      </Section>

      <section aria-labelledby="extension-faq" className="flex flex-col gap-8 border-t py-16 md:py-18">
        <h2 id="extension-faq" className="text-2xl font-semibold tracking-tight md:text-[28px]">
          Questions
        </h2>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {FAQS.map(({ question, answer }, i) => (
            <div key={question} className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">{question}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {answer}
                {i === FAQS.length - 1 && (
                  <>
                    {" "}
                    <Link
                      href={privacyHref}
                      className="text-foreground underline decoration-input underline-offset-4 hover:text-primary"
                    >
                      Read the privacy policy
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CallToAction isAuth={isAuth} />
    </div>
  );
}

function Hero({ privacyHref }: { privacyHref: string }) {
  return (
    <section
      aria-labelledby="extension-title"
      className="grid items-center gap-10 pt-4 pb-16 md:pt-10 md:pb-18 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-16"
    >
      <div className="flex flex-col gap-6">
        <span className="inline-flex h-7 items-center gap-1.5 self-start rounded-md border border-input px-2.5 text-[13px] font-medium text-foreground/75">
          <Puzzle className="size-3.5" />
          Chrome extension
        </span>
        <h1
          id="extension-title"
          className="max-w-[640px] text-4xl leading-[1.05] font-semibold tracking-[-0.035em] md:text-5xl xl:text-[52px]"
        >
          Track problems without leaving LeetCode.
        </h1>
        <p className="max-w-[470px] text-base leading-relaxed text-muted-foreground md:text-lg">
          A small panel on the problem page with a timer and notes. Everything
          you track shows up on your CPTracker dashboard.
        </p>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <InstallButton />
          <Button variant="outline" asChild className="h-10.5 px-4 text-[15px]">
            <Link href={privacyHref}>
              <ShieldCheck />
              Privacy policy
            </Link>
          </Button>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {["Free", "Works on leetcode.com", "Uses your CPTracker sign-in"].map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Check className="size-3.5 text-primary" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-muted-foreground md:hidden">
          Works in Chrome on a computer. Open this page there to install.
        </p>
      </div>

      <figure className="overflow-hidden rounded-xl border bg-card shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
        <Image
          src="/extension/step-2-solving.png"
          alt="The CPTracker panel open on a LeetCode problem with the timer running and notes filled in"
          width={1280}
          height={800}
          sizes="(min-width: 1280px) 60vw, 100vw"
          priority
          className="h-auto w-full"
        />
      </figure>
    </section>
  );
}

function Section({
  eyebrow,
  title,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8 border-t py-16 md:gap-9 md:py-18">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="flex max-w-[640px] flex-col gap-2.5">
          <p className="text-[13px] font-medium text-primary">{eyebrow}</p>
          <h2 className="text-[26px] leading-tight font-semibold tracking-tight md:text-[34px]">
            {title}
          </h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function InstallButton({ className }: { className?: string }) {
  return (
    <Button asChild className={cn("h-10.5 px-4.5 text-[15px] font-semibold", className)}>
      <a href={EXTENSION_STORE_URL} target="_blank" rel="noreferrer">
        <Download />
        Add to Chrome
      </a>
    </Button>
  );
}

function CallToAction({ isAuth }: { isAuth: boolean }) {
  return (
    <section aria-labelledby="extension-cta" className="pb-16 md:pb-20">
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-7 md:flex-row md:items-center md:justify-between md:p-10">
        <div className="flex flex-col gap-2">
          <h2 id="extension-cta" className="text-2xl font-semibold tracking-tight md:text-[28px]">
            Ready for your next problem?
          </h2>
          <p className="text-muted-foreground md:text-base">
            Install it once, then open any LeetCode problem.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <InstallButton />
          <Button variant="outline" asChild className="h-10.5 px-4 text-[15px]">
            <Link href={isAuth ? "/dashboard" : "/auth"}>
              {isAuth ? "Go to dashboard" : "Sign in"}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
