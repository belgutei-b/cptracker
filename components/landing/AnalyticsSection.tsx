import type { ReactNode } from "react";
import { Check } from "lucide-react";

import DailyTimeChart from "@/components/landing/DailyTimeChart";
import DifficultyAverages from "@/components/landing/DifficultyAverages";
import SectionHeading from "@/components/landing/SectionHeading";
import TopicSpeedChart from "@/components/landing/TopicSpeedChart";
import { OVERALL_AVERAGE, TOPIC_SPEEDS } from "@/components/landing/sample-data";
import { cn } from "@/lib/utils";

export default function AnalyticsSection() {
  return (
    <section
      id="analytics"
      aria-labelledby="analytics-title"
      className="landing-band relative scroll-mt-16 border-t"
    >
      {/* lime highlight over the top border */}
      <div aria-hidden className="landing-hairline absolute inset-x-0 -top-px h-px opacity-75" />
      <div className="landing-container flex flex-col gap-14 py-16 md:gap-18 md:py-26">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeading
            id="analytics-title"
            eyebrow="Analytics"
            title="Then see what your time tells you."
          />
          <p className="max-w-[440px] text-base leading-relaxed text-muted-foreground">
            Every tracked minute feeds your analytics. Pick the last week, two
            weeks or month.
          </p>
        </div>

        <FeatureRow
          title="How long each difficulty takes you"
          body="See your average solve time for Easy, Medium and Hard, and whether you’re faster than the period before."
          points={[
            "Average solve time per difficulty",
            "Change from the previous period",
            "Time spent each day, split by difficulty",
          ]}
        >
          <div className="flex flex-col gap-6">
            <DifficultyAverages />
            <DailyTimeChart />
          </div>
        </FeatureRow>

        <FeatureRow
          reverse
          title="Your strong and weak topics"
          body="Each topic’s average solve time is compared with your own overall average, so you can see where you’re quick and which topics to practice next."
          points={[
            "Average solve time per topic",
            "Faster or slower than your average",
            "Problems solved per topic, by difficulty",
          ]}
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold">Topics vs your average</span>
                <span className="text-[13px] text-muted-foreground">
                  Your average solve time:{" "}
                  <span className="font-mono text-foreground">{OVERALL_AVERAGE}</span>
                </span>
              </div>
              <div className="flex gap-3.5 text-[12.5px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px] bg-primary" />
                  Faster
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px] bg-hard" />
                  Slower
                </span>
              </div>
            </div>
            <TopicSpeedChart topics={TOPIC_SPEEDS} detailed />
          </div>
        </FeatureRow>
      </div>
    </section>
  );
}

/** text beside a chart card (stacked below 1280px); `reverse` puts the chart first */
function FeatureRow({
  title,
  body,
  points,
  reverse = false,
  children,
}: {
  title: string;
  body: string;
  points: string[];
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-8 xl:gap-18",
        reverse
          ? "xl:grid-cols-[minmax(0,1fr)_400px]"
          : "xl:grid-cols-[400px_minmax(0,1fr)]",
      )}
    >
      <div className={cn("flex max-w-[640px] flex-col gap-4", reverse && "xl:order-last")}>
        <h3 className="text-2xl leading-tight font-semibold tracking-tight md:text-[26px]">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground">{body}</p>
        <ul className="mt-2 flex flex-col gap-2.5 text-[15px]">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2.5">
              <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7">{children}</div>
    </div>
  );
}
