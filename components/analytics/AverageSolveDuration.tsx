"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DIFFICULTY_COLORS as COLORS } from "@/constants/difficulty";
import type { AnalyticsRangeDays } from "@/constants/analytics";
import { LEETCODE_TAGS } from "@/constants/tags";
import { Search, ChevronDown, Clock, Tag, X } from "lucide-react";

// Generate mock data for different topics
type TopicDayData = {
  date: string;
  avgTime: number;
};

const generateMockTopicData = () => {
  const dataMap: Record<string, TopicDayData[]> = {};
  const now = new Date();

  LEETCODE_TAGS.forEach((tag) => {
    const topicBaseTime = 15 + Math.random() * 45; // Different base time per topic
    const days: TopicDayData[] = [];
    for (let i = 30; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`;

      days.push({
        date: dateStr,
        avgTime: Math.max(
          5,
          Math.floor(topicBaseTime + (Math.random() * 20 - 10)),
        ),
      });
    }
    dataMap[tag] = days;
  });

  // Default "All Topics"
  const allDays: TopicDayData[] = [];
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`;
    allDays.push({
      date: dateStr,
      avgTime: Math.floor(25 + Math.random() * 15),
    });
  }
  dataMap["All Topics"] = allDays;

  return dataMap;
};

const allTopicMockData = generateMockTopicData();

type Props = {
  numberOfDays: AnalyticsRangeDays;
};

export default function AverageSolveDuration({ numberOfDays }: Props) {
  const [selectedTag, setSelectedTag] = useState("All Topics");
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopOverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTags = useMemo(() => {
    const search = tagSearch.toLowerCase();
    return ["All Topics", ...LEETCODE_TAGS].filter((t) =>
      t.toLowerCase().includes(search),
    );
  }, [tagSearch]);

  const chartData = useMemo(() => {
    const sliceCount = numberOfDays;
    return allTopicMockData[selectedTag].slice(-sliceCount);
  }, [numberOfDays, selectedTag]);

  return (
    <div className="bg-[#282828] p-6 rounded-2xl border border-[#3e3e3e] shadow-xl w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-bold text-lg">Topic Efficiency</h3>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
            Avg Solving Duration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Topic Selector */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setIsPopOverOpen(!isPopOverOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#3e3e3e] rounded-lg text-xs font-bold text-gray-300 hover:border-[#ffa116] transition-all min-w-[140px] justify-between"
            >
              <div className="flex items-center gap-2 truncate max-w-[120px]">
                <Tag size={14} className="text-[#ffa116]" />
                <span className="truncate">{selectedTag}</span>
              </div>
              <ChevronDown
                size={14}
                className={`transition-transform ${isPopOverOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isPopOverOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#222] border border-[#3e3e3e] rounded-xl shadow-2xl z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-[#3e3e3e]">
                  <div className="flex items-center bg-[#1a1a1a] rounded-lg px-3 py-2 border border-[#3e3e3e] focus-within:border-[#ffa116]">
                    <Search size={14} className="text-gray-500 mr-2" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search topics..."
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-white w-full"
                    />
                    {tagSearch && (
                      <button
                        onClick={() => setTagSearch("")}
                        className="text-gray-500 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTag(tag);
                          setIsPopOverOpen(false);
                          setTagSearch("");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                          selectedTag === tag
                            ? "bg-[#ffa11615] text-[#ffa116] font-bold"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {tag}
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-600">
                      No topics found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#333"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 10, fontWeight: "bold" }}
              dy={10}
              interval={numberOfDays >= 28 ? 4 : 0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 10 }}
              label={{
                value: "Minutes",
                angle: -90,
                position: "insideLeft",
                fill: "#444",
                fontSize: 9,
                fontWeight: "bold",
                offset: 10,
              }}
            />
            <Tooltip
              cursor={{ fill: "#ffffff05" }}
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #3e3e3e",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
                fontSize: "11px",
              }}
              formatter={(value) => [`${value}m`, "Avg Duration"]}
              itemStyle={{ fontWeight: "bold", color: "#ffa116" }}
            />
            <Bar
              dataKey="avgTime"
              fill="#ffa11633"
              radius={[4, 4, 0, 0]}
              barSize={numberOfDays >= 28 ? 12 : numberOfDays === 14 ? 24 : 40}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.avgTime > 40
                      ? COLORS.Hard
                      : entry.avgTime > 20
                        ? COLORS.Medium
                        : COLORS.Easy
                  }
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-600 border-t border-[#3e3e3e] pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00af9b]"></div>
            <span>Fast (&lt;20m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ffb800]"></div>
            <span>Normal (20-40m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff2d55]"></div>
            <span>Intense (&gt;40m)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#ffa116]">
          <Clock size={12} />
          <span>Metric: Mean Solve Time</span>
        </div>
      </div>
    </div>
  );
}
