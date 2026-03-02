import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookText,
  Brain,
  Gauge,
  TimerReset,
} from "lucide-react";

const coreFeatures = [
  {
    title: "Track Every Solve Session",
    description: "Start a timer as soon as you open a problem",
    icon: TimerReset,
  },
  {
    title: "Save Notes While Solving",
    description:
      "Write your approach, time complexity, and reflections before you close the session.",
    icon: BookText,
  },
  {
    title: "See Time Analytics",
    description:
      "Review total solving time across the last 7 days, 2 weeks, and 1 month.",
    icon: BarChart3,
  },
  {
    title: "Measure by Difficulty",
    description:
      "Compare your average solve speed for Easy, Medium, and Hard questions.",
    icon: Gauge,
  },
];

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-neutral-950 text-white min-h-[calc(100dvh-72px)] md:min-h-[calc(100dvh-84px)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.16),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.14),transparent_40%)]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 mt-6 mb-10">
        <div className="w-full flex justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-amber-500 flex items-center gap-2 hover:cursor-pointer"
          >
            <Brain size={24} /> CPTracker
          </Link>

          <Link
            href="/auth"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
          >
            Sign In
          </Link>
        </div>

        <div className="mx-auto max-w-3xl text-center mt-10">
          <p className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Leetcode Tracker
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Dashboard for your{" "}
            <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
              leetcode progress
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-300 md:text-lg">
            Track problem-solving time, save notes while coding, and understand
            your performance with clean weekly and monthly analytics.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
            >
              Get started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="w-full rounded-2xl bg-neutral-900/50 p-2 ring-1 ring-white/10 backdrop-blur mt-10">
          <Image
            src="/landing-page.png"
            alt="Landing page image"
            width={2000}
            height={2000}
            className="rounded-xl"
          />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {coreFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-2xl bg-neutral-900/65 p-6 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-amber-400/40"
              >
                <span className="inline-flex rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-amber-200">
                  Core Feature
                </span>
                <div className="mt-4 inline-flex rounded-lg bg-neutral-800 p-2 text-amber-300">
                  <Icon size={18} />
                </div>
                <h2 className="mt-3 text-lg font-bold text-white">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/upcoming"
            className="inline-flex items-center gap-2 rounded-lg border border-amber-300/40 bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-300/20"
          >
            See Upcoming Features
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
