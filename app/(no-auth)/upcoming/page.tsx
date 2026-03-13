import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";
import RoundedBoxedTitle from "@/components/no-auth/RoundedBoxedTitle";
import { ArrowRight } from "lucide-react";
import { Inter, Share_Tech_Mono } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const upcomingFeatures = [
  {
    title: "Browser Extension (Chrome + Firefox)",
    eta: "In Development",
    description:
      "Start and track problems directly on LeetCode with synced timer, quick notes, and focus mode without leaving the problem tab.",
    progressClass: "w-3/4 bg-amber-400",
    privacyPolicyLink: "https://www.cptracker.org/extension/privacy-policy",
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
    <main
      className={`${inter.className} relative isolate overflow-hidden bg-neutral-950 text-white min-h-dvh`}
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

      <section className="landing-section-outer border-t-0!">
        <RoundedBoxedTitle title="Product roadmap" />

        <h1 className="mt-7 mb-5 max-w-4xl text-5xl font-extrabold leading-[0.93] tracking-[-0.04em] md:text-[70px]">
          Upcoming Features for
          <br />
          <span className="bg-linear-to-r from-amber-300 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Better Experience
          </span>
        </h1>

        <p className="mb-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
          The next wave focuses on speed, consistency, and competition. We are
          shipping tools that keep you in flow while making progress measurable
          every day.
        </p>

        <div className="mt-10 grid gap-5">
          {upcomingFeatures.map((feature) => (
            <article key={feature.title} className="group landing-box">
              <RoundedBoxedTitle title={feature.eta} />
              <h2 className="mt-4 landing-box-title">{feature.title}</h2>
              <p className="mt-3 landing-box-desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
