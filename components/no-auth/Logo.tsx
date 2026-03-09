import Link from "next/link";
import { Brain } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`mb-8 w-full ${className}`}>
      <Link
        href="/"
        className="text-xl font-bold text-amber-500 flex items-center gap-2 hover:cursor-pointer"
      >
        <Brain size={24} /> CPTracker
      </Link>
    </div>
  );
}
