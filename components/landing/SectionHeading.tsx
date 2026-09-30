import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** small lime eyebrow + large heading used by every landing section */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  className,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-[640px] flex-col gap-3", className)}>
      <p className="text-[13px] font-medium text-primary">{eyebrow}</p>
      <h2
        id={id}
        className="text-3xl leading-[1.1] font-semibold tracking-[-0.03em] md:text-[40px]"
      >
        {title}
      </h2>
    </div>
  );
}
