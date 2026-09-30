import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** bordered section with a title row, used by every analytics chart */
export default function AnalyticsCard({
  title,
  description,
  actions,
  children,
  className,
}: Props) {
  return (
    <section className={cn("min-w-0 rounded-xl border bg-card p-5 md:p-6", className)}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-[13px] text-muted-foreground">{description}</p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
