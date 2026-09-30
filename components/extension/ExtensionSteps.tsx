"use client";

import Image from "next/image";
import { Tabs } from "radix-ui";

import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Open it on a problem",
    body: "Click the CPTracker icon in Chrome’s toolbar while you’re on a LeetCode problem. The problem is added to your tracker. Press Start when you’re ready.",
    image: "/extension/step-1-open.png",
    alt: "The CPTracker panel just opened on a LeetCode problem: the timer shows zero and the Start button is ready",
    caption: "Panel opened on a problem, ready to start",
  },
  {
    title: "Solve with the timer running",
    body: "Code as usual and jot your approach in Notes. When you’re done, mark the problem Tried or Solved.",
    image: "/extension/step-2-solving.png",
    alt: "The timer running at 2 minutes 40 seconds with notes written and Tried and Solved buttons",
    caption: "Timer running while you write notes",
  },
  {
    title: "Keep your notes up to date",
    body: "Your time is saved as soon as you finish. After you submit, come back to refine your notes and press Update notes.",
    image: "/extension/step-3-finished.png",
    alt: "After an accepted submission the timer stopped at 3 minutes 38 seconds and the notes can still be updated",
    caption: "Finished: time saved, notes still editable",
  },
];

// screenshots are 1280×800
const IMAGE_WIDTH = 1280;
const IMAGE_HEIGHT = 800;

function StepNumber({ n, className }: { n: number; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-7.5 shrink-0 items-center justify-center rounded-full border font-mono text-[13px] font-medium",
        className,
      )}
    >
      {n}
    </span>
  );
}

/**
 * How-to steps with the extension screenshots.
 * Large screens: pick a step on the left to see its screenshot.
 * Small screens: every step with its screenshot, stacked.
 */
export default function ExtensionSteps() {
  return (
    <>
      <Tabs.Root
        defaultValue="0"
        orientation="vertical"
        className="hidden items-start gap-10 lg:flex"
      >
        <Tabs.List aria-label="Steps" className="flex w-[400px] shrink-0 flex-col gap-2">
          {STEPS.map((step, i) => (
            <Tabs.Trigger
              key={step.title}
              value={String(i)}
              className="group flex gap-4 rounded-xl border border-transparent p-4.5 text-left transition-colors outline-none hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=active]:border-input data-[state=active]:bg-card"
            >
              <StepNumber
                n={i + 1}
                className="text-muted-foreground group-data-[state=active]:border-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground"
              />
              <span className="flex flex-col gap-1.5">
                <span className="text-base font-semibold">{step.title}</span>
                <span className="text-sm leading-relaxed text-muted-foreground group-data-[state=active]:text-foreground/75">
                  {step.body}
                </span>
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {STEPS.map((step, i) => (
          <Tabs.Content key={step.title} value={String(i)} className="min-w-0 flex-1 outline-none">
            <figure className="flex flex-col gap-3.5">
              <div className="overflow-hidden rounded-xl border bg-card">
                <Image
                  src={step.image}
                  alt={step.alt}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  sizes="(min-width: 1440px) 900px, 60vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="flex justify-between text-[13px] text-muted-foreground">
                <span>{step.caption}</span>
                <span className="font-mono">
                  Step {i + 1} of {STEPS.length}
                </span>
              </figcaption>
            </figure>
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <ol className="flex flex-col gap-8 lg:hidden">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <StepNumber n={i + 1} className="border-primary bg-primary text-primary-foreground" />
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border bg-card">
              <Image
                src={step.image}
                alt={step.alt}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                sizes="100vw"
                className="h-auto w-full"
              />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
