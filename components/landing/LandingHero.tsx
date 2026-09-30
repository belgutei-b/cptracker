import Link from "next/link";
import { ArrowRight, Puzzle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LiveDot } from "@/components/problems/ProblemLabels";
import ProductPreview from "@/components/landing/ProductPreview";

export default function LandingHero({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section
      aria-labelledby="landing-title"
      className="landing-container flex flex-col items-center gap-7 pt-16 pb-16 text-center md:pt-24 md:pb-24"
    >
      <span className="inline-flex h-7.5 items-center gap-2 rounded-full border border-input px-3 text-[13px] font-medium text-foreground/75">
        <LiveDot />
        LeetCode time tracker and analytics
      </span>

      <h1
        id="landing-title"
        className="max-w-[980px] text-[40px] leading-[1.03] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-[66px]"
      >
        Time every problem. See where you’re strong and where you’re slow.
      </h1>
      <p className="max-w-[680px] text-base leading-relaxed text-pretty text-muted-foreground md:text-[19px]">
        CPTracker times each LeetCode session, tried or solved, then shows your
        average solve time by difficulty and by topic, so you know what to
        practice next.
      </p>

      <div className="mt-1 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
        <Button asChild className="h-11.5 px-5 text-base font-semibold">
          <Link href={isSignedIn ? "/dashboard" : "/auth"}>
            {isSignedIn ? "Go to dashboard" : "Start tracking"}
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11.5 px-4.5 text-base">
          <Link href="/extension">
            <Puzzle />
            Chrome extension
          </Link>
        </Button>
      </div>

      {/* the preview needs desktop width to be readable */}
      <ProductPreview className="mt-11 hidden lg:block" />
    </section>
  );
}
