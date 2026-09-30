import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** bordered section with a title row; content controls its own padding */
export default function ProfileCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border bg-card", className)}>
      <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-[13px] text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
