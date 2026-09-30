import type { Metadata } from "next";
import ExtensionBody from "@/components/extension/ExtensionBody";

export const metadata: Metadata = {
  title: "Chrome Extension - CPTracker",
  description:
    "Track LeetCode problems without leaving LeetCode: a timer and notes on the problem page, synced to your CPTracker dashboard.",
};

/**
 * Extension page for signed-out visitors (inside the landing layout)
 */
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-10">
      <ExtensionBody isAuth={false} />
    </main>
  );
}
