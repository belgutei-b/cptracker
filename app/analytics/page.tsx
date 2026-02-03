import TotalSolveDuration from "@/components/analytics/TotalSolveDuration";
import AverageSolveDuration from "@/components/analytics/AverageSolveDuration";
import { Timer, Trophy } from "lucide-react";

export default async function Page() {
  return (
    <div className="mt-5 ml-5">
      <div className="text-xl text-white font-bold mb-5">
        Performance Analytics
      </div>
      <div className="flex gap-10 mb-5">
        <div className="bg-[#282828] border-[#3e3e3e] rounded-xl w-40">
          <div className="flex justify-between px-3 py-2">
            <div className="">
              <p className="text-gray-400">Solved</p>
              <p className="text-xl font-bold text-white">20</p>
            </div>
            <div className="bg-amber-500 text-white p-1 mr-1 h-min rounded-md">
              <Trophy size={20} className="" />
            </div>
          </div>
        </div>

        <div className="bg-[#282828] border-[#3e3e3e] rounded-xl w-40">
          <div className="flex justify-between px-3 py-2">
            <div className="">
              <p className=" text-gray-400">Time Spent</p>
              <p className="text-xl text-white">5h 30m</p>
            </div>
            <div className="bg-emerald-500 text-white p-1 mr-1 h-min rounded-md">
              <Timer size={20} />
            </div>
          </div>
        </div>

        <div className="bg-[#282828] border-[#3e3e3e] rounded-xl w-40">
          <div className="flex justify-between px-3 py-2">
            <div className="">
              <p className="text text-gray-400">Time Spent</p>
              <p className="text-xl text-white">5h 30m</p>
            </div>
            <div className="bg-sky-500 text-white p-1 mr-1 h-min rounded-md">
              <Timer size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-180 space-y-10">
        <TotalSolveDuration />

        <AverageSolveDuration />
      </div>
    </div>
  );
}
