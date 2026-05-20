import LegalPage from "@/components/legal/LegalPage";
import { extensionPrivacyPolicyContent } from "@/components/legal/legal-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chrome Extension Privacy Policy - CPTracker",
  description:
    "Learn what data the CPTracker Chrome extension handles and how it is used.",
};

/**
 * Extension Privacy page for authenticated users
 * This page is added to keep layout consistency across authenticated pages
 */
export default function Page() {
  return <LegalPage content={extensionPrivacyPolicyContent} />;
}
