import { Difficulty } from "@/prisma/generated/prisma/enums";

export type DifficultyMode = "all" | "easy" | "medium" | "hard";

export const DIFFICULTY_MODE_TO_DIFFICULTY: Record<
  DifficultyMode,
  Difficulty
> = {
  all: Difficulty.All,
  easy: Difficulty.Easy,
  medium: Difficulty.Medium,
  hard: Difficulty.Hard,
};

const MODES: { key: DifficultyMode; label: string }[] = [
  { key: "all", label: "All" },
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

type Props = {
  value: DifficultyMode;
  onChange: (value: DifficultyMode) => void;
};

export default function DifficultyModeSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[#1e1e1e] bg-[#0c0c0e] p-1">
      {MODES.map((mode) => (
        <button
          key={mode.key}
          type="button"
          onClick={() => onChange(mode.key)}
          className={`rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
            value === mode.key
              ? "bg-[#1e1e1e] text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
