import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4 md:gap-5">
      <Skeleton className="size-14 rounded-full md:size-[72px]" />
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80 max-w-[60vw]" />
      </div>
    </div>
  );
}

/** placeholder while a profile tab loads its data */
export function ProfileTabSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true" aria-label="Loading">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[118px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
