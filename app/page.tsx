import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookText,
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
    <main className="min-h-[calc(100vh-72px)] bg-neutral-900 text-white">
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Leetcode Tracker
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Dashboard for your leetcode progress
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-300 md:text-lg">
            Track problem-solving time, save notes while coding, and understand
            your performance with clean weekly and monthly analytics.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
            >
              Open Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/analytics"
              className="rounded-lg border border-[#3e3e3e] bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-amber-500/40 hover:text-white"
            >
              View Analytics
            </Link>
          </div>
        </div>

        <div className="w-full">
          <Image
            src="/landing-page.png"
            alt="Landing page image"
            width={2000}
            height={2000}
          />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {coreFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-[#3e3e3e] bg-[#282828] p-5"
              >
                <Icon size={18} className="text-amber-400" />
                <h2 className="mt-3 text-lg font-bold text-white">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
