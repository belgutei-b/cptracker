import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function AnalyticsCard({
  title,
  description,
  actions,
  children,
  className = "",
}: Props) {
  return (
    <section
      className={`relative min-w-0 w-full overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111113] p-5 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold tracking-tight text-white">
            {title}
          </p>
          <p className="mt-0.5 font-mono text-xs text-neutral-400">
            {description}
          </p>
        </div>
        {actions}
      </div>

      {children}
    </section>
  );
}
