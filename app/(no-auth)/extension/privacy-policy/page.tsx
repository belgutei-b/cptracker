import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";

const dataCategories = [
  {
    title: "Personally identifiable information",
    description:
      "We process account-level profile data associated with your CPTracker account, such as user ID and username/email when available, only to identify your account and sync your problem tracking data.",
  },
  {
    title: "Authentication information",
    description:
      "We use your existing cptracker.org authenticated session state to authorize extension requests. We do not collect passwords or PINs in the extension popup.",
  },
  {
    title: "Web history",
    description:
      "When you open the extension popup, we read the active tab URL only to confirm it is a LeetCode problem page and connect that problem to your CPTracker account.",
  },
  {
    title: "Website content",
    description:
      "We process the LeetCode problem link (URL/hyperlink) as website resource content so your timer, notes, and status updates are saved for the correct problem.",
  },
  {
    title: "How data is used?",
    description:
      "We do not sell user data. We do not use user data for advertising. We only use these data categories to power extension features such as problem linking, timer actions, notes updates, and analytics sync with cptracker.org.",
  },
];

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-neutral-950 text-white min-h-dvh">
      <Background />

      <section className="relative mx-auto max-w-6xl px-6 mt-6 mb-10">
        <Logo />

        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          CPTracker Extension{" "}
          <span className="bg-linear-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            Privacy Policy
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base text-neutral-300 sm:text-lg">
          This page explains what data categories are handled by the CPTracker
          browser extension and why each category is needed to provide the
          extension single purpose: tracking LeetCode solving sessions for your
          CPTracker account.
        </p>

        <p className="mt-2 text-xs text-neutral-400">
          Last updated: March 9, 2026
        </p>

        <div className="mt-10 grid gap-5">
          {dataCategories.map((category) => (
            <article key={category.title} className="group feature-article">
              <h2 className="feature-title capitalize">{category.title}</h2>
              <p className="feature-description">{category.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
