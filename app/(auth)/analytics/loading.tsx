import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="page-container flex flex-col gap-6" aria-busy="true" aria-label="Loading analytics">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[118px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[360px] rounded-xl" />
      <Skeleton className="h-52 rounded-xl" />
    </main>
  );
}
