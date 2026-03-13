import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";

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
    <main className="relative isolate overflow-hidden bg-neutral-950 text-white min-h-dvh">
      <Background />

      <section className="relative mx-auto max-w-6xl px-6 mt-6 mb-10">
        <Logo />

        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          CPTracker Extension brings CPTracker directly into your{" "}
          <span className="bg-linear-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            LeetCode workflow
          </span>
        </h1>

        <p className="mt-5 max-w-3xl text-base text-neutral-300 sm:text-lg">
          If you already use{" "}
          <Link
            href="https://www.cptracker.org"
            target="_blank"
            rel="noreferrer"
            className="text-amber-300 underline underline-offset-4 transition hover:text-amber-200"
          >
            cptracker.org
          </Link>
          , this extension removes tab-switching friction while you solve.
        </p>

        <article className="mt-10 landing-box">
          <h2 className="landing-box-title">Why install it?</h2>
          <p className="landing-box-desc">
            Stay focused on coding in LeetCode while still capturing the data
            you need for reflection and improvement. Your tracked sessions power
            CPTracker analytics like total time spent, average solve duration,
            and progress by difficulty.
          </p>
        </article>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white">How it flows</h2>

          <div className="mt-5 space-y-4">
            {workflowScreens.map((screen, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={screen.title}>
                  <article
                    className={`landing-box w-full md:max-w-3xl ${
                      isLeft ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <p className="text-xs font-semibold tracking-wide text-amber-200 uppercase">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {screen.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      {screen.description}
                    </p>

                    <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/10 bg-neutral-950/80">
                      <Image
                        src={screen.image}
                        alt={screen.alt}
                        width={1800}
                        height={1100}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </article>

                  {index < workflowScreens.length - 1 ? (
                    <div
                      className={`mt-3 hidden text-amber-300 md:flex ${
                        isLeft ? "justify-end pr-10" : "justify-start pl-10"
                      }`}
                    >
                      <ArrowRight
                        className={`h-5 w-5 ${
                          isLeft ? "rotate-90" : "-rotate-90"
                        }`}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-xs text-neutral-400">
          CPTracker Extension is an independent tool and is not affiliated with
          or endorsed by LeetCode.
        </p>
      </section>
    </main>
  );
}
