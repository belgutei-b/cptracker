import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookText,
  Gauge,
  TimerReset,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Background from "@/components/no-auth/Background";
import RoundedBoxedTitle from "@/components/no-auth/RoundedBoxedTitle";
import Logo from "@/components/no-auth/Logo";

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

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative isolate overflow-hidden bg-neutral-950 text-white min-h-[calc(100dvh-72px)] md:min-h-[calc(100dvh-84px)]">
      <Background />

      <section className="relative mx-auto max-w-6xl px-6 mt-6 mb-10">
        <Logo className="mb-0!" />
        <div className="mx-auto max-w-3xl text-center mt-10">
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Dashboard for your{" "}
            <span className="bg-linear-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
              leetcode progress
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-300 md:text-lg">
            Track problem-solving time, save notes while coding, and understand
            your performance with clean weekly and monthly analytics.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/auth" className="landing-button">
              Get Started
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
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-amber-300">
                    <Icon className="h-5 w-5" />
                  </div>
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
          <Link href="/upcoming" className="landing-button">
            View Upcoming Features
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
