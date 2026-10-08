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
    <main className="landing-container pt-10">
      <ExtensionBody isAuth={false} />
    </main>
  );
}
