import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AnalyticsEmptyState({
  children,
  className = "h-40",
}: Props) {
  return (
    <div
      className={`flex items-center justify-center text-xs font-semibold text-neutral-600 ${className}`}
    >
      {children}
    </div>
  );
}
