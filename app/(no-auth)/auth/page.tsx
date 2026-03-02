import Auth from "@/components/Auth";
import { Brain } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-4">
        <Link
          href="/"
          className="text-xl font-bold text-amber-500 flex items-center gap-2 hover:cursor-pointer"
        >
          <Brain size={24} /> CPTracker
        </Link>
      </div>
      <div className="w-full border-b border-neutral-700" />
      <Auth />
    </>
  );
}
