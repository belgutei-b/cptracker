import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Inter, Share_Tech_Mono } from "next/font/google";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";
import TotalSolveDuration from "@/components/analytics/TotalSolveDuration";
import type { BarChartData } from "@/types/stat";
import Extension from "@/components/no-auth/Extension";
import RoundedBoxedTitle from "@/components/no-auth/RoundedBoxedTitle";

const inter = Inter({ subsets: ["latin"] });
const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });

const landingChartData: BarChartData[] = [
  { date: "Mon", easy: 0, medium: 0, hard: 0, problemCount: 0 },
  { date: "Tue", easy: 1800, medium: 2700, hard: 0, problemCount: 3 },
  { date: "Wed", easy: 900, medium: 0, hard: 4500, problemCount: 2 },
  { date: "Thu", easy: 1200, medium: 3600, hard: 0, problemCount: 4 },
  { date: "Fri", easy: 600, medium: 1800, hard: 5400, problemCount: 3 },
  { date: "Sat", easy: 2400, medium: 4200, hard: 3600, problemCount: 6 },
  { date: "Sun", easy: 1500, medium: 2100, hard: 0, problemCount: 3 },
];

const goals = [
  {
    number: "01",
    title: "Count + time = the real picture",
    desc: "Solved count is useful. But it doesn't tell you if you spent 20 minutes or 3 hours. Time is the missing half of the metric — and CPTracker tracks both together.",
  },
  {
    number: "02",
    title: "Every attempt counts",
    desc: "Spent 90 minutes on a problem you didn't submit? That's not a failure — that's real work. Mark it as tried. It still counts toward your total time and keeps your progress honest.",
  },
  {
    number: "03",
    title: "Progress you can see",
    desc: "Daily breakdowns, weekly totals, average time per difficulty. When your progress is visible, you always know if you're moving forward — or just going through the motions.",
  },
];

const setupSteps = [
  {
    number: "01",
    title: "Paste a LeetCode problem URL",
    desc: "The problem is added to your dashboard.",
  },
  {
    number: "02",
    title: "Start the timer",
    desc: "Start solving the problem.",
  },
  {
    number: "03",
    title: "Log notes & mark status",
    desc: "Write your approach and observations. Mark the problem Tried or Solved when you're done.",
  },
  {
    number: "04",
    title: "Watch it add up",
    desc: "Your total time grows every session. Check your weekly breakdown anytime.",
  },
];

const weeklyDifficultyTotals = landingChartData.reduce(
  (totals, day) => ({
    easy: totals.easy + day.easy,
    medium: totals.medium + day.medium,
    hard: totals.hard + day.hard,
  }),
  { easy: 0, medium: 0, hard: 0 },
);

const xpBars = [
  {
    label: "Easy",
    hours: weeklyDifficultyTotals.easy / 3600,
    color: "#00b8a3",
  },
  {
    label: "Medium",
    hours: weeklyDifficultyTotals.medium / 3600,
    color: "#ffc01e",
  },
  {
    label: "Hard",
    hours: weeklyDifficultyTotals.hard / 3600,
    color: "#ff375f",
  },
];

const maxXpHours = Math.max(...xpBars.map((bar) => bar.hours), 1);

function formatHours(hours: number): string {
  return `${hours.toFixed(1)}h`;
}

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main
      className={`${inter.className} relative isolate overflow-hidden bg-neutral-950 text-white`}
    >
      <Background />

      {/* Nav */}
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <Logo className="mb-0!" />

        <Link
          href="/auth"
          className="landing-orange-button whitespace-nowrap px-4 py-2 text-sm"
        >
          Get Started
          <ArrowRight size={14} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="landing-section-outer border-t-0!">
        <RoundedBoxedTitle title="Competitive programming tracker" />

        <h1 className="mt-7 mb-5 max-w-4xl text-5xl font-extrabold leading-[0.93] tracking-[-0.04em] md:text-[70px]">
          Solve count is good
          <br />
          <span className="bg-linear-to-r from-amber-300 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            With time it is even better
          </span>
        </h1>

        <p className="mb-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
          Solved count burns people out. You grind for hours, submit nothing,
          and the number doesn&apos;t move.{" "}
          <span className="text-zinc-200">Time always moves.</span> Every
          session, tried or solved, adds to a total you can actually see grow.
        </p>

        <p
          className={"mb-8 max-w-lg text-[13px] leading-relaxed text-zinc-600"}
        >
          Think of it like XP. In a game you always know if you&apos;re leveling
          up. CPTracker gives you that for your journey.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/auth"
            className="landing-orange-button px-5 py-3 text-sm tracking-tight"
          >
            Start tracking
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/upcoming"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] px-5 py-3 text-sm font-medium text-zinc-400 transition-all hover:border-white/[0.14] hover:text-zinc-100"
          >
            Upcoming features
            <ChevronRight size={13} />
          </Link>
        </div>

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
              className={`${shareTechMono.className} my-5 text-5xl font-bold tracking-wider text-amber-400`}
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
              <div className="text-3xl font-bold text-white">14h 32m</div>
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
              <div className="text-3xl font-bold text-amber-400">6 days</div>
              <p className="text-neutral-500 text-xs mt-1">keep it going</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section-outer">
        <p className="landing-section-title-desc">How it works</p>
        <h2 className="landing-section-title">Setup steps.</h2>
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 md:grid-cols-4">
          {setupSteps.map((step, i) => (
            <div
              key={step.number}
              className={`bg-neutral-900/70 p-4 md:p-6 ${
                i < setupSteps.length - 1
                  ? "border-[#1e1e1e] border-r border-b md:border-b-0"
                  : ""
              }`}
            >
              <p className={`${shareTechMono.className} landing-box-number`}>
                {step.number}
              </p>
              <p className="mb-1.5 landing-box-title">{step.title}</p>
              <p className="landing-box-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics */}
      <section className="landing-section-outer">
        <p className="landing-section-title-desc">Analytics</p>
        <h2 className="landing-section-title">Your time, at a glance.</h2>

        <TotalSolveDuration
          numberOfDays={7}
          chartData={landingChartData}
          isLoading={false}
        />

        <div className="relative overflow-hidden mt-10 rounded-2xl border border-[#1e1e1e] bg-[#111113] p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(245,158,11,0.12),transparent_42%)]" />

          <div className="flex flex-col md:flex-row w-full space-y-5 md:space-x-20">
            <div className="w-80">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Time always moves
              </div>

              <h2 className="mt-4 max-w-sm text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
                If you practiced,
                <br />
                it should show up.
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
                Solve count only sees submissions. This sees the hours. Easy,
                Medium, Hard. Tried or solved.
              </p>

              <p
                className={`${shareTechMono.className} mt-3 max-w-sm text-[12px] leading-relaxed text-neutral-600`}
              >
                Think of it like XP. The bar should move when the work happens.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4 flex-1">
              {xpBars.map((bar) => (
                <div key={bar.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-300">
                      {bar.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`${shareTechMono.className} text-xs`}
                        style={{ color: bar.color }}
                      >
                        {formatHours(bar.hours)}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#1a1a1a]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(bar.hours / maxXpHours) * 100}%`,
                        background: bar.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Goal */}
      <section className="landing-section-outer">
        <p className="landing-section-title-desc">Goal</p>
        <h2 className="landing-section-title">Built around what matters.</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.number} className="landing-box">
              <div className={`${shareTechMono.className} landing-box-number`}>
                {goal.number}
              </div>
              <h3 className="landing-box-title">{goal.title}</h3>
              <p className="mt-3 landing-box-desc">{goal.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chrome extension */}
      <Extension />

      {/* Bottom CTA */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 border-t border-white/5">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/15 bg-[#111113] px-8 py-12 text-center md:px-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.09),transparent_58%)]" />

          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white md:text-5xl">
              Ready to see how much time
              <br />
              <span className="bg-linear-to-r from-amber-300 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                you&apos;re really putting in?
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
              Start tracking your sessions today. Free to use, no setup needed.
            </p>

            <Link
              href="/auth"
              className="landing-orange-button relative mt-8 px-6 py-3.5 text-sm tracking-tight transition-all hover:-translate-y-px"
            >
              Get started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
