import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 8;

/** table-shaped placeholder while problems load */
export default function ProblemListSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading problems">
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-8 w-full sm:w-64" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-8 w-80" />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="h-10 border-b bg-muted/40" />
        {Array.from({ length: ROWS }, (_, i) => (
          <div
            key={i}
            className="flex h-[53px] items-center gap-6 border-b px-4 last:border-b-0"
          >
            <Skeleton className="hidden h-4 w-8 sm:block" />
            <Skeleton className="h-4 flex-1 md:max-w-80" />
            <Skeleton className="hidden h-4 w-16 md:block" />
            <Skeleton className="hidden h-4 w-24 md:block" />
            <Skeleton className="ml-auto h-4 w-14" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
