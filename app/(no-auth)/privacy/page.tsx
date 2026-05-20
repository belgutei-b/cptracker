import LegalPage from "@/components/legal/LegalPage";
import { privacyPolicyContent } from "@/components/legal/legal-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - CPTracker",
  description:
    "Learn what data CPTracker collects, how it is used, and how to request deletion.",
};

export default function Page() {
  return <LegalPage content={privacyPolicyContent} />;
}
