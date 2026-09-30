import DifficultyAverages from "@/components/landing/DifficultyAverages";
import TopicSpeedChart from "@/components/landing/TopicSpeedChart";
import {
  OVERALL_AVERAGE,
  PREVIEW_PROBLEMS,
  TOPIC_SPEEDS,
} from "@/components/landing/sample-data";
import {
  DifficultyText,
  LiveDot,
  StatusLabel,
} from "@/components/problems/ProblemLabels";
import { cn } from "@/lib/utils";

const PREVIEW_TOPICS = TOPIC_SPEEDS.filter((t) => t.topic !== "Sliding Window");

/** static picture of the dashboard next to the analytics it produces */
export default function ProductPreview({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Preview: the problems table with a running timer, next to average solve times by difficulty and by topic"
      className={cn(
        "h-[480px] w-full overflow-hidden rounded-2xl border bg-card text-left shadow-[0_50px_120px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="flex h-full">
        <div className="flex min-w-0 flex-1 flex-col gap-4.5 px-7 pt-7">
          <div>
            <p className="text-[22px] font-semibold tracking-tight">Problems</p>
            <p className="mt-1 text-[13px] text-muted-foreground">Start a timer from any row</p>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <div className="grid h-9 grid-cols-[minmax(0,1fr)_76px_120px_84px] items-center gap-x-3 bg-muted/40 px-3.5 text-xs font-medium text-muted-foreground">
              <span>Problem</span>
              <span>Difficulty</span>
              <span>Status</span>
              <span className="text-right">Time</span>
            </div>
            {PREVIEW_PROBLEMS.map((problem) => {
              const running = problem.status === "IN_PROGRESS";
              return (
                <div
                  key={problem.title}
                  className="grid h-11.5 grid-cols-[minmax(0,1fr)_76px_120px_84px] items-center gap-x-3 border-t px-3.5 text-[13.5px]"
                >
                  <span className="truncate font-medium">{problem.title}</span>
                  <DifficultyText difficulty={problem.difficulty} className="text-[12.5px]" />
                  <StatusLabel status={problem.status} className="text-[12.5px]" />
                  <span
                    className={cn(
                      "flex items-center justify-end gap-2 font-mono text-[12.5px]",
                      running ? "text-primary" : "text-foreground/75",
                    )}
                  >
                    {running && <LiveDot />}
                    {problem.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex w-[420px] shrink-0 flex-col gap-6 border-l bg-background p-7">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold">Average solve time</span>
              <span className="text-xs text-muted-foreground">Last 30 days</span>
            </div>
            <DifficultyAverages compact />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold">Topics vs your average</span>
              <span className="text-xs text-muted-foreground">{OVERALL_AVERAGE} avg</span>
            </div>
            <TopicSpeedChart topics={PREVIEW_TOPICS} />
          </div>
        </div>
      </div>
    </div>
  );
}
