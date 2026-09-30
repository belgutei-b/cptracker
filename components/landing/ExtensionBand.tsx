import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EXTENSION_STORE_URL } from "@/constants/links";

export default function ExtensionBand() {
  return (
    <section aria-labelledby="extension-band-title" className="landing-container pb-16 md:pb-26">
      <div className="flex flex-col overflow-hidden rounded-3xl border bg-card lg:flex-row lg:items-center">
        <div className="flex flex-col gap-5 p-7 md:p-14 lg:w-[460px] lg:shrink-0">
          <p className="text-[13px] font-medium text-primary">Chrome extension</p>
          <h2
            id="extension-band-title"
            className="text-3xl leading-tight font-semibold tracking-[-0.025em] md:text-[34px]"
          >
            Track without leaving LeetCode.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Open the panel on a problem to add it, run the timer and write
            notes, right next to your code.
          </p>
          <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
            <Button asChild className="h-10.5 px-4 text-[15px] font-semibold">
              <a href={EXTENSION_STORE_URL} target="_blank" rel="noreferrer">
                <Download />
                Add to Chrome
              </a>
            </Button>
            <Button asChild variant="outline" className="h-10.5 px-4 text-[15px]">
              <Link href="/extension">How it works</Link>
            </Button>
          </div>
        </div>

        {/* the screenshot bleeds off the card's right edge on large screens */}
        <div className="min-w-0 flex-1 px-7 pb-7 lg:py-10 lg:pr-0 lg:pl-0">
          <div className="overflow-hidden rounded-xl border border-input lg:rounded-r-none lg:border-r-0">
            <Image
              src="/extension/step-2-solving.png"
              alt="The CPTracker extension panel open on a LeetCode problem with the timer running"
              width={1280}
              height={800}
              sizes="(min-width: 1024px) 700px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
