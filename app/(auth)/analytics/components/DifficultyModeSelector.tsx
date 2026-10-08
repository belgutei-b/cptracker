"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Difficulty } from "@/prisma/generated/prisma/enums";

export type DifficultyMode = "all" | "easy" | "medium" | "hard";

export const DIFFICULTY_MODE_TO_DIFFICULTY: Record<DifficultyMode, Difficulty> = {
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
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      aria-label="Difficulty"
      value={value}
      // a single toggle group can be emptied; keep one option selected
      onValueChange={(next) => next && onChange(next as DifficultyMode)}
    >
      {MODES.map((mode) => (
        <ToggleGroupItem key={mode.key} value={mode.key}>
          {mode.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
