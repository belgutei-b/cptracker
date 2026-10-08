import Link from "next/link";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppLogo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 text-[15px] font-semibold tracking-tight",
        className,
      )}
    >
      <span className="flex size-6.5 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Terminal className="size-4" strokeWidth={2.5} />
      </span>
      CPTracker
    </Link>
  );
}
