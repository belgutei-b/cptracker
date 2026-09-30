import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FinalCta({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <section aria-labelledby="final-cta-title" className="landing-container pb-16 md:pb-26">
      <div className="flex flex-col items-center gap-5 rounded-3xl border bg-card px-6 py-14 text-center md:p-18">
        <h2
          id="final-cta-title"
          className="max-w-[760px] text-3xl leading-[1.08] font-semibold tracking-[-0.035em] md:text-[44px]"
        >
          Find out where your time really goes.
        </h2>
        <p className="text-base text-muted-foreground md:text-[17px]">
          Time your next problem. Your analytics start from there.
        </p>
        <Button asChild className="mt-2 h-11.5 w-full px-5 text-base font-semibold sm:w-auto">
          <Link href={isSignedIn ? "/dashboard" : "/auth"}>
            {isSignedIn ? "Go to dashboard" : "Get started"}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
