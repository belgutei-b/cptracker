import {
  ProfileHeaderSkeleton,
  ProfileTabSkeleton,
} from "@/components/profile/ProfileSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="page-container flex flex-col gap-7">
      <ProfileHeaderSkeleton />
      <Skeleton className="h-8 w-64" />
      <ProfileTabSkeleton />
    </main>
  );
}
