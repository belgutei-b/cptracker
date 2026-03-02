import { Brain } from "lucide-react";
import Link from "next/link";

const upcomingFeatures = [
  {
    title: "Browser Extension (Chrome + Firefox)",
    eta: "In Development",
    description:
      "Start and track problems directly on LeetCode with synced timer, quick notes, and focus mode without leaving the problem tab.",
    progressClass: "w-3/4 bg-amber-400",
  },
  {
    title: "Public Leaderboard",
    eta: "Planned",
    description:
      "Compare progress with other users by solved count, streak consistency, and deep-work time to keep momentum visible.",
    progressClass: "w-1/2 bg-orange-400",
  },
];

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-neutral-950 text-white min-h-[100dvh]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.16),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.14),transparent_40%)]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 mt-6 mb-10">
        <div className="mb-8 w-full">
          <Link
            href="/"
            className="text-xl font-bold text-amber-500 flex items-center gap-2 hover:cursor-pointer"
          >
            <Brain size={24} /> CPTracker
          </Link>
        </div>

        <p className="inline-flex w-fit rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          Product Roadmap
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Upcoming Features Built to Make Your LeetCode Grind{" "}
          <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            Faster and Sharper
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base text-neutral-300 sm:text-lg">
          The next wave focuses on speed, consistency, and healthy competition.
          We are shipping tools that keep you in flow while making progress
          measurable every day.
        </p>

        <div className="mt-10 grid gap-5">
          {upcomingFeatures.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl bg-neutral-900/65 p-6 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-amber-400/40"
            >
              <span className="inline-flex rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-amber-200">
                {feature.eta}
              </span>
              <h2 className="mt-4 text-xl font-bold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                {feature.description}
              </p>
              <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div className={`h-full rounded-full ${feature.progressClass}`} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
