import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";
import RoundedBoxedTitle from "@/components/no-auth/RoundedBoxedTitle";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const workflowScreens = [
  {
    title: "Open Popup",
    description:
      "Open the extension popup on a LeetCode problem to link the current problem in one click.",
    image: "/extension/start.png",
    alt: "CPTracker extension popup opened on a LeetCode problem",
  },
  {
    title: "Track While Solving",
    description:
      "Run the timer as you solve and capture notes, time complexity, and space complexity.",
    image: "/extension/solving.png",
    alt: "CPTracker extension popup with active timer and notes while solving",
  },
  {
    title: "Mark Solved",
    description:
      "Stop the timer and mark the problem as Solved so your session is saved to CPTracker analytics.",
    image: "/extension/solved.png",
    alt: "CPTracker extension popup after a problem is solved",
  },
];

export default function Page() {
  return (
    <main
      className={`${inter.className} relative isolate overflow-hidden bg-neutral-950 text-white min-h-dvh`}
    >
      <Background />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <Logo className="mb-0!" />
      </div>

      <section className="landing-section-outer border-t-0!">
        <RoundedBoxedTitle title="Chrome extension" />

        <h1 className="mt-7 mb-5 max-w-4xl text-4xl font-extrabold leading-[0.93] tracking-[-0.04em] md:text-5xl">
          CPTracker Extension brings CPTracker
          <br />
          <span className="bg-linear-to-r from-amber-300 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Directly into your LeetCode flow
          </span>
        </h1>

        <p className="my-5 text-neutral-300 text-base sm:text-lg">
          Removes tab-switching friction while you solve.
        </p>

        <div className="flex flex-wrap items-start md:flex-row md:items-center gap-3 mt-10 md:mt-20">
          <Link
            href="https://chromewebstore.google.com/detail/ojpjlobnleonmgehlhoibaicokoadcnm?utm_source=item-share-cb"
            target="_blank"
            rel="noreferrer"
            className="landing-button landing-button-orange"
          >
            Install extension
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/extension/privacy-policy"
            className="landing-button landing-button-transparent"
          >
            Privacy policy
            <ChevronRight size={13} />
          </Link>
        </div>
      </section>

      {/* Why install it */}
      <section className="landing-section-outer">
        <p className="landing-section-title-desc">Why install it.</p>
        <h2 className="landing-section-title">Motivation.</h2>
        <p className="text-neutral-300">
          Stay focused on coding in LeetCode while still capturing the data you
          need for reflection and improvement. Your tracked sessions power
          CPTracker analytics like total time spent, average solve duration, and
          progress by difficulty.
        </p>
      </section>

      {/* How to use it */}
      <section className="landing-section-outer">
        <p className="landing-section-title-desc">How to use it</p>
        <h2 className="landing-section-title">Workflow.</h2>
        <div className="mt-5 space-y-8 md:space-y-10">
          {workflowScreens.map((screen, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={screen.title}>
                <article
                  className={`landing-box w-full flex flex-col md:items-center md:justify-between md:gap-10 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="max-w-80 md:flex-1">
                    <p className="text-xs font-semibold tracking-wide text-amber-400 uppercase">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {screen.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      {screen.description}
                    </p>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/10 bg-neutral-950/80 md:mt-0 md:w-110 lg:w-140 md:shrink-0">
                    <Image
                      src={screen.image}
                      alt={screen.alt}
                      width={1800}
                      height={1100}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
