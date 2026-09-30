import type { Metadata } from "next";
import ExtensionBody from "@/components/extension/ExtensionBody";

export const metadata: Metadata = {
  title: "Chrome Extension - CPTracker",
};

/**
 * Extension page for signed-in users (inside the app layout)
 */
export default function Page() {
  return (
    <main className="page-container">
      <ExtensionBody isAuth={true} />
    </main>
  );
}
