import Link from "next/link";
import { Download, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import DailyQuestionButton from "@/components/navbar/DailyQuestionButton";

/** first-run state, shown when the user has no problems at all */
export default function ProblemEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-6 py-20 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl border bg-muted text-foreground/75">
        <List className="size-5" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-semibold">No problems yet</h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Paste a LeetCode link above to start tracking, or install the
          extension to log problems while you solve them on LeetCode.
        </p>
      </div>
      <div className="mt-1 flex flex-wrap justify-center gap-2">
        <Button variant="outline" asChild>
          <Link href="/extension-auth">
            <Download />
            Get the extension
          </Link>
        </Button>
        <DailyQuestionButton />
      </div>
    </div>
  );
}
