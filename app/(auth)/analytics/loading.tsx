export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-white">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-700 border-t-[#ffa116]" />
        Loading analytics…
      </div>
    </main>
  );
}
