import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AnalyticsTooltip({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-xl border border-[#2e2e2e] bg-[#141414] px-3 py-2.5 font-mono text-xs shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
