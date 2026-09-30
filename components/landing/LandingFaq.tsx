import SectionHeading from "@/components/landing/SectionHeading";

const FAQS = [
  {
    question: "Is it free?",
    answer: "Yes. Sign in with GitHub or Google and start tracking.",
  },
  {
    question: "How are strong and weak topics decided?",
    answer:
      "By comparing each topic’s average solve time with your own overall average, for the same difficulty.",
  },
  {
    question: "Do I need the extension?",
    answer:
      "No. You can paste links and run the timer from the dashboard. The extension just saves you the tab switching.",
  },
  {
    question: "Is it open source?",
    answer: "Yes, under the MIT license.",
  },
];

export default function LandingFaq() {
  return (
    <section aria-labelledby="faq-title" className="border-t">
      <div className="landing-container flex flex-col gap-10 py-16 md:py-26 lg:flex-row lg:gap-18">
        <SectionHeading id="faq-title" eyebrow="FAQ" title="Good to know." className="lg:w-[420px] lg:shrink-0" />
        <dl className="grid flex-1 gap-8 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-9">
          {FAQS.map(({ question, answer }) => (
            <div key={question} className="flex flex-col gap-2">
              <dt className="text-base font-semibold">{question}</dt>
              <dd className="text-[14.5px] leading-relaxed text-muted-foreground">{answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
