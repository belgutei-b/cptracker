export default function ProblemListSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="border border-[#3e3e3e] bg-[#282828] rounded-xl p-4 w-90 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-60 space-y-2">
              <div className="h-3 w-20 rounded bg-[#3e3e3e]" />
              <div className="h-5 w-44 rounded bg-[#3e3e3e]" />
            </div>
            <div className="w-30 flex flex-col items-end gap-2">
              <div className="h-3 w-20 rounded bg-[#3e3e3e]" />
              <div className="h-4 w-14 rounded bg-[#3e3e3e]" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap my-3">
            <div className="h-4 w-12 rounded bg-[#3e3e3e]" />
            <div className="h-4 w-10 rounded bg-[#3e3e3e]" />
            <div className="h-4 w-14 rounded bg-[#3e3e3e]" />
          </div>

          <div className="w-full items-center flex justify-between border-t pt-3 border-[#3e3e3e]">
            <div className="h-8 w-8 rounded-lg bg-[#3e3e3e]" />
            <div className="h-4 w-16 rounded bg-[#3e3e3e]" />
          </div>
        </div>
      ))}
    </div>
  );
}
