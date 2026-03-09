export default function RoundedBoxedTitle({ title }: { title: string }) {
  return (
    <p className="inline-flex w-fit rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
      {title}
    </p>
  );
}
