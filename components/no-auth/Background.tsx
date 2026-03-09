export default function Background() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-104 w-104 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.16),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.14),transparent_40%)]" />
    </div>
  );
}
