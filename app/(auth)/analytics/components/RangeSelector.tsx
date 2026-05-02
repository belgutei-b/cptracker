"use client";

import { useRouter } from "next/navigation";
import {
  ANALYTICS_RANGE_OPTIONS,
  type AnalyticsRangeDays,
} from "@/constants/analytics";

type Props = {
  current: AnalyticsRangeDays;
};

export default function RangeSelector({ current }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center rounded-lg border border-[#3e3e3e] bg-[#1a1a1a] p-1">
      {ANALYTICS_RANGE_OPTIONS.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => router.push(`?range=${range}`)}
          className={`rounded-md px-3 py-1 text-[10px] font-bold uppercase transition-all ${
            current === range
              ? "bg-[#ffa116] text-black shadow-lg shadow-[#ffa11633]"
              : "text-gray-500 hover:text-white"
          }`}
        >
          {range === 7 ? "7 Days" : range === 14 ? "2 Weeks" : "1 Month"}
        </button>
      ))}
    </div>
  );
}
