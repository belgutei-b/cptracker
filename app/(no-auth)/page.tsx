import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";
import TotalSolveDuration from "@/components/analytics/TotalSolveDuration";
import type { BarChartData } from "@/types/stat";

const orbitron = Orbitron({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const mockChartData: BarChartData[] = [
  { date: "Mar 6", easy: 1800, medium: 2700, hard: 0, problemCount: 3 },
  { date: "Mar 7", easy: 0, medium: 3600, hard: 5400, problemCount: 2 },
  { date: "Mar 8", easy: 900, medium: 1800, hard: 3600, problemCount: 3 },
  { date: "Mar 9", easy: 1200, medium: 4500, hard: 0, problemCount: 4 },
  { date: "Mar 10", easy: 1800, medium: 2700, hard: 4500, problemCount: 4 },
  { date: "Mar 11", easy: 0, medium: 0, hard: 0, problemCount: 0 },
  { date: "Mar 12", easy: 900, medium: 3600, hard: 5400, problemCount: 3 },
];

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative isolate overflow-hidden bg-neutral-950 text-white">
      <Background />

      {/* Nav */}
      <nav className="relative mx-auto max-w-6xl px-6 pt-6 flex items-center justify-between">
        <Logo className="mb-0!" />
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black bg-amber-500 transition-colors hover:bg-amber-400 whitespace-nowrap shadow-[0_6px_28px_rgba(245,158,11,0.2)]"
        >
          Get Started
          <ArrowRight size={14} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Time-first problem tracking
        </div>

        <h1
          className={`${spaceGrotesk.className} text-5xl font-bold leading-tight md:text-7xl max-w-3xl`}
        >
          Solve count is good.
          <br />
          Solve count +{" "}
          <span className="bg-linear-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            time is better.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-neutral-400 leading-relaxed">
          Tracking solved problems is a solid metric. But knowing you solved 3
          Hard problems that each took 90 minutes tells a completely different
          story. CPTracker adds time to the equation — so you see not just what
          you solved, but exactly how much effort it took.
        </p>

        <Link
          href="/auth"
          className="mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-base font-semibold text-black bg-amber-500 transition-colors hover:bg-amber-400 shadow-[0_6px_28px_rgba(245,158,11,0.2)]"
        >
          Start tracking for free
          <ArrowRight size={16} />
        </Link>

        {/* Mock session + stats cards */}
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {/* Active session card */}
          <div className="md:col-span-2 rounded-2xl bg-neutral-900/70 border border-white/10 p-6 backdrop-blur">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                  Current Session
                </p>
                <h3 className="text-base font-bold text-white leading-snug">
                  Longest Substring Without Repeating Characters
                </h3>
                <span className="mt-2 inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">
                  Medium
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400">Live</span>
              </div>
            </div>

            <div
              className={`${orbitron.className} text-5xl font-bold text-amber-400 tracking-wider my-5`}
            >
              00:23:47
            </div>

            <div className="rounded-xl bg-neutral-800/60 p-4 min-h-[80px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                Notes
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Sliding window. Keep a hashmap of char → index. Move left
                pointer when we see a repeat...
              </p>
            </div>
          </div>

          {/* Weekly stats + streak */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-neutral-900/70 border border-white/10 p-5 backdrop-blur flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
                This Week
              </p>
              <div
                className={`${orbitron.className} text-3xl font-bold text-white`}
              >
                14h 32m
              </div>
              <p className="text-neutral-500 text-xs mt-1">total time spent</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-[#00af9b]">8</div>
                  <div className="text-xs text-neutral-500">Easy</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#ffb800]">12</div>
                  <div className="text-xs text-neutral-500">Med</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#ff2d55]">3</div>
                  <div className="text-xs text-neutral-500">Hard</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-neutral-900/70 border border-white/10 p-5 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                Streak
              </p>
              <div
                className={`${orbitron.className} text-3xl font-bold text-amber-400`}
              >
                6 days
              </div>
              <p className="text-neutral-500 text-xs mt-1">keep it going</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chart section */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 border-t border-white/5">
        <h2 className={`${spaceGrotesk.className} text-3xl font-bold text-white`}>
          Your time, at a glance.
        </h2>
        <p className="mt-3 text-neutral-400 max-w-xl leading-relaxed">
          Every bar is a day. Every color is a difficulty level. See exactly how
          much time you put in — not just whether you showed up.
        </p>
        <div className="mt-8">
          <TotalSolveDuration
            numberOfDays={7}
            chartData={mockChartData}
            isLoading={false}
          />
        </div>
      </section>

      {/* Features section */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 border-t border-white/5">
        <h2 className={`${spaceGrotesk.className} text-3xl font-bold text-white mb-10`}>
          Built around what matters.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-neutral-900/65 p-7 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-amber-400/40">
            <div className={`${orbitron.className} text-5xl font-bold text-neutral-800 mb-4`}>
              01
            </div>
            <h3 className={`${spaceGrotesk.className} text-xl font-bold text-white`}>
              Count + time = the real picture
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Solved count is useful. But it doesn&apos;t tell you if you spent
              20 minutes or 3 hours. Time is the missing half of the metric —
              and CPTracker tracks both together.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-900/65 p-7 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-amber-400/40">
            <div className={`${orbitron.className} text-5xl font-bold text-neutral-800 mb-4`}>
              02
            </div>
            <h3 className={`${spaceGrotesk.className} text-xl font-bold text-white`}>
              Every attempt counts
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Spent 90 minutes on a problem you didn&apos;t submit? That&apos;s
              not a failure — that&apos;s real work. Mark it as tried. It still
              counts toward your total time and keeps your progress honest.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-900/65 p-7 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-amber-400/40">
            <div className={`${orbitron.className} text-5xl font-bold text-neutral-800 mb-4`}>
              03
            </div>
            <h3 className={`${spaceGrotesk.className} text-xl font-bold text-white`}>
              Progress you can see
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              Daily breakdowns, weekly totals, average time per difficulty. When
              your progress is visible, you always know if you&apos;re moving
              forward — or just going through the motions.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 border-t border-white/5">
        <h2 className={`${spaceGrotesk.className} text-3xl font-bold text-white mb-10`}>Zero setup.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              n: "01",
              title: "Paste a LeetCode URL",
              desc: "The problem is added to your dashboard automatically.",
            },
            {
              n: "02",
              title: "Start the timer",
              desc: "One click. The clock runs through thinking, failing, and retrying.",
            },
            {
              n: "03",
              title: "Log notes & mark status",
              desc: "Write your approach. Mark it Tried or Solved when you're done.",
            },
            {
              n: "04",
              title: "Watch it add up",
              desc: "Your total time grows every session. Check your weekly breakdown anytime.",
            },
          ].map((step, i) => (
            <div key={step.n} className="relative">
              {i < 3 && (
                <div
                  className={`absolute top-13 left-full w-4 h-px bg-neutral-700/60 z-10 ${i % 2 === 0 ? "" : "hidden md:block"}`}
                />
              )}
              <div className="h-full rounded-2xl bg-neutral-900/65 p-7 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-amber-400/40">
                <div
                  className={`${orbitron.className} text-5xl font-bold text-neutral-800 mb-4`}
                >
                  {step.n}
                </div>
                <h3 className={`${spaceGrotesk.className} text-xl font-bold text-white`}>{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 text-center border-t border-white/5">
        <h2 className={`${spaceGrotesk.className} text-4xl font-bold text-white max-w-2xl mx-auto leading-tight`}>
          Ready to see how much time you&apos;re really putting in?
        </h2>
        <p className="mt-4 text-neutral-400 max-w-lg mx-auto">
          Start tracking your sessions today. Free to use, no setup needed.
        </p>
        <Link
          href="/auth"
          className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-black bg-amber-500 transition-colors hover:bg-amber-400 shadow-[0_6px_28px_rgba(245,158,11,0.2)]"
        >
          Get started — it&apos;s free
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
