import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";
import RoundedBoxedTitle from "@/components/no-auth/RoundedBoxedTitle";
import Link from "next/link";

const upcomingFeatures = [
  {
    title: "Browser Extension (Chrome + Firefox)",
    eta: "In Development",
    description:
      "Start and track problems directly on LeetCode with synced timer, quick notes, and focus mode without leaving the problem tab.",
    progressClass: "w-3/4 bg-amber-400",
    privacyPolicyLink: "https://www.cptracker.org/extension/privacy-policy",
  },
  {
    title: "Public Leaderboard",
    eta: "Planned",
    description:
      "Compare progress with other users by solved count, streak consistency, and deep-work time to keep momentum visible.",
    progressClass: "w-1/2 bg-orange-400",
  },
];

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-neutral-950 text-white min-h-dvh">
      <Background />

      <section className="relative mx-auto max-w-6xl px-6 mt-6 mb-10">
        <Logo />
        <RoundedBoxedTitle title="Product Roadmap" />

        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Upcoming Features Built to Make Your LeetCode Grind{" "}
          <span className="bg-linear-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            Faster and Sharper
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base text-neutral-300 sm:text-lg">
          The next wave focuses on speed, consistency, and healthy competition.
          We are shipping tools that keep you in flow while making progress
          measurable every day.
        </p>

        <div className="mt-10 grid gap-5">
          {upcomingFeatures.map((feature) => (
            <article key={feature.title} className="group feature-article">
              <span className="inline-flex rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-amber-200">
                {feature.eta}
              </span>
              <h2 className="mt-4 feature-title">{feature.title}</h2>
              <p className="feature-description">{feature.description}</p>
              {feature.privacyPolicyLink && (
                <p className="mt-3 text-sm text-neutral-400">
                  Extension privacy policy is available at:{" "}
                  <Link
                    href="/extension/privacy-policy"
                    className="text-amber-300 underline underline-offset-2 hover:text-amber-200"
                  >
                    {feature.privacyPolicyLink}
                  </Link>
                </p>
              )}
              <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className={`h-full rounded-full ${feature.progressClass}`}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
