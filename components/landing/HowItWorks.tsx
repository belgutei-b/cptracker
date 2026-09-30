import type { ReactNode } from "react";

import SectionHeading from "@/components/landing/SectionHeading";
import { TOPIC_SPEEDS } from "@/components/landing/sample-data";
import { LiveDot } from "@/components/problems/ProblemLabels";
import { cn } from "@/lib/utils";

const STEPS: { title: string; body: string; illustration: ReactNode }[] = [
  {
    title: "Add a problem",
    body: "Paste a LeetCode link on your dashboard, or open the extension on the problem page.",
    illustration: (
      <div className="flex w-full gap-1.5 px-5">
        <span className="flex h-8.5 flex-1 items-center truncate rounded-md border border-input px-2.5 text-xs text-muted-foreground">
          leetcode.com/problems/3sum
        </span>
        <span className="flex h-8.5 items-center rounded-md bg-primary px-2.5 text-xs font-semibold text-primary-foreground">
          Add
        </span>
      </div>
    ),
  },
  {
    title: "Start the timer",
    body: "Solve at your own pace. The timer is kept on our side, so closing the tab won’t stop it.",
    illustration: (
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          <LiveDot />
          Timer running
        </span>
        <span className="font-mono text-[34px] font-medium tracking-tight">00:18:32</span>
      </div>
    ),
  },
  {
    title: "Finish with notes",
    body: "Write your approach and complexity, then mark it Tried or Solved.",
    illustration: (
      <div className="flex flex-col gap-2.5 px-5">
        <div className="flex gap-1.5 font-mono text-[11.5px] text-foreground/75">
          <span className="rounded-md border border-input px-2 py-0.5">O(n²) time</span>
          <span className="rounded-md border border-input px-2 py-0.5">O(1) space</span>
        </div>
        <div className="flex gap-1.5 text-[12.5px]">
          <span className="flex h-7.5 items-center rounded-md border border-input px-3 font-medium">Tried</span>
          <span className="flex h-7.5 items-center rounded-md bg-primary px-3 font-semibold text-primary-foreground">
            Solved
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Learn from it",
    body: "Check your averages by difficulty and topic, then pick what to practice next.",
    illustration: <MiniTopicBars />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-16 border-t">
      <div className="landing-container flex flex-col gap-12 py-16 md:py-26">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="Add a problem, start the timer, get back to solving."
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col overflow-hidden rounded-2xl border bg-card">
              <div aria-hidden className="flex h-33 items-center justify-center border-b bg-background">
                {step.illustration}
              </div>
              <div className="flex flex-col gap-2 p-5.5">
                <span className="font-mono text-[13px] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[17px] font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// fastest two topics and the slowest one
const MINI_TOPICS = [TOPIC_SPEEDS[0], TOPIC_SPEEDS[1], TOPIC_SPEEDS[TOPIC_SPEEDS.length - 1]];

function MiniTopicBars() {
  return (
    <div className="flex w-full flex-col gap-2 px-5">
      {MINI_TOPICS.map(({ topic, vsAverage }) => (
        <div key={topic} className="grid grid-cols-[92px_minmax(0,1fr)_44px] items-center gap-2 text-[11.5px]">
          <span className="truncate text-foreground/75">{topic}</span>
          <span
            className={cn("h-2 rounded-[3px]", vsAverage < 0 ? "bg-primary" : "bg-hard")}
            style={{ width: `${Math.min(Math.abs(vsAverage) / 70, 1) * 100}%` }}
          />
          <span className={cn("text-right font-mono", vsAverage < 0 ? "text-primary" : "text-hard")}>
            {vsAverage < 0 ? "−" : "+"}
            {Math.abs(vsAverage)}%
          </span>
        </div>
      ))}
    </div>
  );
}
