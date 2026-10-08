import type { Metadata } from "next";

import AnalyticsSection from "@/components/landing/AnalyticsSection";
import ExtensionBand from "@/components/landing/ExtensionBand";
import FeatureStrip from "@/components/landing/FeatureStrip";
import FinalCta from "@/components/landing/FinalCta";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFaq from "@/components/landing/LandingFaq";
import LandingHero from "@/components/landing/LandingHero";
import WhyTimeSection from "@/components/landing/WhyTimeSection";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "CPTracker - LeetCode time tracker and analytics",
  description:
    "Time every LeetCode problem, tried or solved, and see your average solve time by difficulty and topic.",
};

export default async function Page() {
  const isSignedIn = !!(await getSession());

  return (
    <main>
      <LandingHero isSignedIn={isSignedIn} />
      <FeatureStrip />
      <AnalyticsSection />
      <WhyTimeSection />
      <HowItWorks />
      <ExtensionBand />
      <LandingFaq />
      <FinalCta isSignedIn={isSignedIn} />
    </main>
  );
}
