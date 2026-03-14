import RoundedBoxedTitle from "@/components/no-auth/RoundedBoxedTitle";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Extension() {
  const extensionHighlights = [
    "Start the timer from any LeetCode page",
    "Write notes in the popup and sync them to your dashboard",
    "Mark a problem Tried or Solved without leaving the tab",
  ];
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16 border-t border-white/5">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(245,158,11,0.12),transparent_45%)]" />

        <div className="relative flex flex-col gap-10 p-4 md:p-10 md:flex-row md:items-center">
          <div className="flex-1">
            <RoundedBoxedTitle title="Chrome extension" />

            <h2 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white md:text-4xl">
              Stay in the flow.
              <br />
              <span className="text-neutral-400">No more tab switching.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
              The CPTracker Chrome extension lets you add a problem, start the
              timer, and save notes right from LeetCode. Same workflow, fewer
              interruptions.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {extensionHighlights.map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span className="text-sm text-neutral-300">{line}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-7 md:mt-5">
              <Link
                href="https://chromewebstore.google.com/detail/ojpjlobnleonmgehlhoibaicokoadcnm?utm_source=item-share-cb"
                className="landing-button landing-button-orange"
                target="_blank"
                rel="noreferrer"
              >
                Add extension
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/extension"
                className="landing-button landing-button-transparent"
              >
                View extension details
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="w-full shrink-0 md:w-64">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-neutral-700" />
                <span className="h-2 w-2 rounded-full bg-neutral-700" />
                <span className="h-2 w-2 rounded-full bg-neutral-700" />
                <span className="ml-auto text-[9px] text-neutral-500">
                  cptracker
                </span>
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                    Active
                  </span>
                  <span className="rounded bg-yellow-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-yellow-400">
                    Medium
                  </span>
                </div>

                <p className="mb-3 text-xs font-semibold leading-snug text-neutral-200">
                  3Sum
                </p>

                <div className="mb-3 rounded-lg border border-white/10 py-3 text-center text-3xl text-neutral-100">
                  18:<span className="text-amber-400">44</span>
                </div>

                <div className="mb-2 rounded-lg bg-amber-500 py-2 text-center text-xs font-bold text-black">
                  Pause
                </div>

                <div className="mb-2 flex gap-2">
                  <div className="flex-1 rounded-md border border-white/10 py-1.5 text-center text-[10px] font-semibold text-neutral-500">
                    Tried
                  </div>
                  <div className="flex-1 rounded-md border border-white/10 py-1.5 text-center text-[10px] font-semibold text-neutral-500">
                    Solved
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-[10px] text-neutral-500">
                  Two pointers after sort...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
