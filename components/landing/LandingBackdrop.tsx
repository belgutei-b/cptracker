import { cn } from "@/lib/utils";

const EDGE_CLASSES = {
  top: { grid: "landing-fade-top", glow: "landing-glow-top", line: "top-0" },
  bottom: { grid: "landing-fade-bottom", glow: "landing-glow-bottom", line: "bottom-0" },
};

/**
 * Grid and lime light behind a landing block, coming from one edge.
 * The parent needs `relative isolate` so this sits under its content.
 */
export default function LandingBackdrop({ edge }: { edge: "top" | "bottom" }) {
  const classes = EDGE_CLASSES[edge];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className={cn("landing-grid absolute inset-0", classes.grid)} />
      <div className={cn("absolute inset-0", classes.glow)} />
      <div className={cn("landing-hairline absolute inset-x-0 h-px", classes.line)} />
    </div>
  );
}
