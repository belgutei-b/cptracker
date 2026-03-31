import RoundedBoxedTitle from "@/components/no-auth/RoundedBoxedTitle";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Share_Tech_Mono } from "next/font/google";
import Link from "next/link";

const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });

const dataCategories = [
  {
    title: "Personally identifiable information",
    desc: "We process account-level profile data associated with your CPTracker account, such as user ID and username/email when available, only to identify your account and sync your problem tracking data.",
  },
  {
    title: "Authentication information",
    desc: "We use your existing cptracker.org authenticated session state to authorize extension requests. We do not collect passwords or PINs in the extension popup.",
  },
  {
    title: "Web history",
    desc: "When you open the extension popup, we read the active tab URL only to confirm it is a LeetCode problem page and connect that problem to your CPTracker account.",
  },
  {
    title: "Website content",
    desc: "We process the LeetCode problem link (URL/hyperlink) as website resource content so your timer, notes, and status updates are saved for the correct problem.",
  },
  {
    title: "How data is used?",
    desc: "We do not sell user data. We do not use user data for advertising. We only use these data categories to power extension features such as problem linking, timer actions, notes updates, and analytics sync with cptracker.org.",
  },
];

/**
 * In extension privacy policy page, what data is collected from the user while using the extension
 * @param isAuth whether the component is imported to authenticated users page
 * @returns
 */
export default function ExtensionPrivacyBody({ isAuth }: { isAuth: boolean }) {
  return (
    <div>
      <section className="landing-section-outer border-t-0!">
        <RoundedBoxedTitle title="Chrome extension" />

        <h1 className="mt-7 mb-5 max-w-4xl text-4xl text-white font-extrabold leading-[0.93] tracking-[-0.04em] md:text-5xl">
          CPTracker Chrome Extension
          <br />
          <span className="bg-linear-to-r from-amber-300 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Privacy Policy
          </span>
        </h1>

        <p className="my-5 text-neutral-300 text-base sm:text-lg">
          This page explains what data categories are handled by the CPTracker
          browser extension and why each category is needed to provide the
          extension single purpose: tracking LeetCode solving sessions for your
          CPTracker account.
        </p>

        <p className="mt-2 text-xs text-neutral-400">
          Last updated: March 9, 2026
        </p>

        <div className="flex flex-wrap items-start md:flex-row md:items-center gap-3 mt-10 md:mt-20">
          <Link
            href="https://chromewebstore.google.com/detail/ojpjlobnleonmgehlhoibaicokoadcnm?utm_source=item-share-cb"
            target="_blank"
            rel="noreferrer"
            className="landing-button landing-button-orange"
          >
            Install extension
            <ArrowRight size={16} />
          </Link>
          <Link
            href={isAuth ? "/extension-auth" : "/extension"}
            className="landing-button landing-button-transparent"
          >
            About Extension
            <ChevronRight size={13} />
          </Link>
        </div>
      </section>

      <div className="landing-section-outer md:mt-10 grid gap-5">
        {dataCategories.map((category, i) => (
          <article key={category.title} className="group landing-box">
            <div className={`${shareTechMono.className} landing-box-number`}>
              0{i + 1}
            </div>
            <h3 className="landing-box-title">{category.title}</h3>
            <p className="landing-box-desc mt-3">{category.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
