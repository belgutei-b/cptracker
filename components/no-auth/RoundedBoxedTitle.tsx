export default function RoundedBoxedTitle({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-400">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      {title}
    </div>
  );
}
