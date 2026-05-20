import LegalPage from "@/components/legal/LegalPage";
import { termsContent } from "@/components/legal/legal-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - CPTracker",
  description:
    "Read the rules and terms that apply when using CPTracker.",
};

export default function Page() {
  return <LegalPage content={termsContent} />;
}
