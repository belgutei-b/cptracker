import { Skeleton } from "@/components/ui/skeleton";
import ProblemListSkeleton from "@/components/problems/ProblemListSkeleton";

export default function Loading() {
  return (
    <main className="page-container flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <ProblemListSkeleton />
    </main>
  );
}
