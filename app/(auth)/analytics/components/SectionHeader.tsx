export default function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-base font-semibold tracking-tight text-white">
        {title}
      </p>
      <p className="mt-0.5 font-mono text-xs text-neutral-400">{description}</p>
    </div>
  );
}
