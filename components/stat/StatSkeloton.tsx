export default function StatSkeloton() {
  return (
    <div className="space-y-6">
      <div className="bg-[#282828] p-6 rounded-xl border border-[#3e3e3e] animate-pulse w-80">
        <div className="h-3 w-40 rounded bg-[#3e3e3e] mb-6" />
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`duration-${index}`}>
              <div className="flex justify-between mb-2">
                <div className="h-3 w-10 rounded bg-[#3e3e3e]" />
                <div className="h-3 w-6 rounded bg-[#3e3e3e]" />
              </div>
              <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#3e3e3e] w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#282828] p-6 rounded-xl border border-[#3e3e3e] animate-pulse w-80">
        <div className="h-3 w-44 rounded bg-[#3e3e3e] mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`ratio-${index}`} className="flex items-center gap-3">
              <div className="h-3 w-12 rounded bg-[#3e3e3e]" />
              <div className="h-2 flex-1 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div className="h-full w-1/3 bg-[#3e3e3e]" />
              </div>
              <div className="h-3 w-10 rounded bg-[#3e3e3e]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
