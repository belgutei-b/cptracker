import { ChartColumnBig, Tag, Timer } from "lucide-react";

const FEATURES = [
  {
    icon: Timer,
    title: "Time every attempt",
    body: "Solved or just tried, every session adds to your total.",
  },
  {
    icon: ChartColumnBig,
    title: "Solve time by difficulty",
    body: "Your average for Easy, Medium and Hard, and whether it’s improving.",
  },
  {
    icon: Tag,
    title: "Strong and weak topics",
    body: "Which topics you solve faster than your average, and which slow you down.",
  },
];

/** the three things CPTracker does, right under the hero */
export default function FeatureStrip() {
  return (
    <section aria-label="What CPTracker does" className="landing-container pb-16 md:pb-26">
      <ul className="grid divide-y overflow-hidden rounded-2xl border md:grid-cols-3 md:divide-x md:divide-y-0">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex flex-col gap-2.5 px-6 py-6 md:px-7.5 md:py-7">
            <Icon className="size-5 text-primary" />
            <h3 className="text-[17px] font-semibold">{title}</h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
