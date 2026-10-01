import type { Metadata } from "next";
import Auth from "@/components/Auth";

export const metadata: Metadata = {
  title: "Sign in - CPTracker",
  description:
    "Sign in to CPTracker to time your LeetCode problems and see your solve time by difficulty and topic.",
};

export default function Page() {
  return (
    <main className="landing-container flex justify-center py-16 md:py-26">
      <Auth />
    </main>
  );
}
