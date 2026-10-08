"use client";

import { Fragment, useState } from "react";
import Markdown from "markdown-to-jsx";
import { Check, ExternalLink, Lock, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  DifficultyText,
  LiveDot,
  StatusLabel,
} from "@/components/problems/ProblemLabels";
import { cn } from "@/lib/utils";
import { useNowTick } from "@/hooks/useNowTick";
import { getDisplayedMilliseconds, isTimerRunning } from "@/lib/timer";
import type { ProblemDifficulty } from "@/constants/difficulty";
import type { UserProblemFullClient } from "@/types/client";
import { useFinishProblemMutation } from "@/hooks/problems/useFinishProblemMutation";
import { useSaveProblemMutation } from "@/hooks/problems/useSaveProblemMutation";
import { useDeleteProblemMutation } from "@/hooks/problems/useDeleteProblemMutation";

type NoteMode = "edit" | "preview";

const NOTE_MARKDOWN_OPTIONS = {
  disableParsingRawHTML: true,
  wrapper: Fragment,
  overrides: {
    a: {
      props: {
        target: "_blank",
        rel: "noreferrer",
      },
    },
  },
};

/**
 * Side sheet for solving a problem: timer, complexities, notes and finish actions.
 * Unsaved changes are saved when the sheet closes.
 */
export default function ProblemSolving({
  problem,
  onCloseAction,
}: {
  problem: UserProblemFullClient | null;
  onCloseAction: () => void;
}) {
  if (!problem) return null;

  // keyed so the form state resets when another problem is opened
  return (
    <ProblemSolvingSheet
      key={problem.id}
      problem={problem}
      onCloseAction={onCloseAction}
    />
  );
}

function ProblemSolvingSheet({
  problem,
  onCloseAction,
}: {
  problem: UserProblemFullClient;
  onCloseAction: () => void;
}) {
  const [note, setNote] = useState(problem.note ?? "");
  const [timeComplexity, setTimeComplexity] = useState(
    problem.timeComplexity ?? "",
  );
  const [spaceComplexity, setSpaceComplexity] = useState(
    problem.spaceComplexity ?? "",
  );
  const [savedValues, setSavedValues] = useState({
    note: problem.note ?? "",
    timeComplexity: problem.timeComplexity ?? "",
    spaceComplexity: problem.spaceComplexity ?? "",
  });
  const [noteMode, setNoteMode] = useState<NoteMode>("edit");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const finishMutation = useFinishProblemMutation();
  const saveMutation = useSaveProblemMutation();
  const deleteMutation = useDeleteProblemMutation();

  const isFinishing = finishMutation.isPending;
  const isSaving = saveMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isBusy = isFinishing || isSaving || isDeleting;

  const hasChanges =
    note !== savedValues.note ||
    timeComplexity !== savedValues.timeComplexity ||
    spaceComplexity !== savedValues.spaceComplexity;
  const isFinished = problem.status === "SOLVED" || problem.status === "TRIED";

  function handleClose() {
    if (isBusy) return;

    if (hasChanges) {
      // if this request fails the notes are lost; the mutation toasts the error
      saveMutation.mutate({
        userProblemId: problem.id,
        note,
        timeComplexity,
        spaceComplexity,
      });
    }

    onCloseAction();
  }

  // finish and save both send the current fields
  async function handleFinish(newStatus: "SOLVED" | "TRIED") {
    try {
      await finishMutation.mutateAsync({
        userProblemId: problem.id,
        newStatus,
        note,
        timeComplexity,
        spaceComplexity,
      });
      setSavedValues({ note, timeComplexity, spaceComplexity });
    } catch {
      // the mutation already toasts the error
    }
  }

  async function handleSave() {
    try {
      await saveMutation.mutateAsync({
        userProblemId: problem.id,
        note,
        timeComplexity,
        spaceComplexity,
      });
      setSavedValues({ note, timeComplexity, spaceComplexity });
    } catch {
      // the mutation already toasts the error
    }
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync({ userProblemId: problem.id });
    } catch {
      // the mutation already toasts; keep the dialog open so the user can retry
      return;
    }

    // the problem no longer exists, so the sheet cannot stay open
    setIsConfirmingDelete(false);
    onCloseAction();
  }

  return (
    <Sheet open onOpenChange={(open) => !open && handleClose()}>
      <SheetContent
        className="gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[560px]"
        // focus the panel itself instead of jumping into the first input
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).focus();
        }}
      >
        <ProblemHeader problem={problem} />
        <SolveTimer problem={problem} />

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ComplexityField
              id="time-complexity"
              label="Time complexity"
              placeholder="O(n log n)"
              value={timeComplexity}
              onChange={setTimeComplexity}
            />
            <ComplexityField
              id="space-complexity"
              label="Space complexity"
              placeholder="O(1)"
              value={spaceComplexity}
              onChange={setSpaceComplexity}
            />
          </div>

          <Tabs
            value={noteMode}
            onValueChange={(value) => setNoteMode(value as NoteMode)}
            className="min-h-64 flex-1"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="problem-note">Notes</Label>
              <TabsList>
                <TabsTrigger value="edit" className="px-2.5">
                  Write
                </TabsTrigger>
                <TabsTrigger value="preview" className="px-2.5">
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="edit" className="flex">
              <Textarea
                id="problem-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Approach, edge cases, mistakes. Markdown works."
                className="field-sizing-fixed flex-1 resize-none font-mono text-[13px] leading-relaxed"
              />
            </TabsContent>
            <TabsContent value="preview" className="problem-note-markdown overflow-y-auto">
              {note.trim() ? (
                <Markdown options={NOTE_MARKDOWN_OPTIONS}>{note}</Markdown>
              ) : (
                <p className="text-muted-foreground">Nothing to preview yet.</p>
              )}
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground">
            Notes save when you close this panel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => setIsConfirmingDelete(true)}
            disabled={isBusy}
            className="mr-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
            <span className="sr-only sm:not-sr-only">Delete</span>
          </Button>

          {isFinished ? (
            <Button onClick={handleSave} disabled={isBusy || !hasChanges} size="lg">
              {isSaving ? "Saving..." : "Save notes"}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleFinish("TRIED")}
                disabled={isBusy}
              >
                Mark as tried
              </Button>
              <Button
                size="lg"
                onClick={() => handleFinish("SOLVED")}
                disabled={isBusy}
              >
                <Check />
                Mark as solved
              </Button>
            </>
          )}
        </div>

        <AlertDialog
          open={isConfirmingDelete}
          onOpenChange={(open) => !isDeleting && setIsConfirmingDelete(open)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this problem?</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="text-foreground">{problem.problem.title}</span>{" "}
                and all of its solve sessions will be removed from your
                tracker. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              {/* a plain button, so the dialog stays open while deleting */}
              <Button
                variant="destructive"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}

function ProblemHeader({ problem }: { problem: UserProblemFullClient }) {
  const { title, questionId, link, tags } = problem.problem;

  return (
    <SheetHeader className="gap-3 px-6 pt-5 pb-5">
      <div className="flex items-center gap-2 pr-10 text-xs">
        <span className="rounded-md border px-2 py-0.5">
          <DifficultyText difficulty={problem.problem.difficulty as ProblemDifficulty} />
        </span>
        <span
          className={cn(
            "rounded-md border px-2 py-0.5",
            isTimerRunning(problem) && "border-primary/35 bg-primary/5 text-primary",
          )}
        >
          <StatusLabel status={problem.status} />
        </span>
      </div>

      <SheetTitle className="text-2xl font-semibold tracking-tight">
        <span className="font-mono font-medium text-muted-foreground">
          {questionId}.
        </span>{" "}
        {title}
      </SheetTitle>

      <SheetDescription asChild>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            Open on LeetCode
            <ExternalLink className="size-3.5" />
          </a>
          {problem.status === "SOLVED" ? (
            <span className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border bg-muted px-2 py-0.5 text-xs text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5" />
              Topics hidden until solved
            </span>
          )}
        </div>
      </SheetDescription>
    </SheetHeader>
  );
}

function formatTimer(totalMs: number) {
  const safeMs = Math.max(0, Math.floor(totalMs));
  const totalSeconds = Math.floor(safeMs / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const cs = String(Math.floor((safeMs % 1000) / 10)).padStart(2, "0");

  return { main: `${hh}:${mm}:${ss}`, centiseconds: cs };
}

/** its own component so the 10ms tick only re-renders the timer */
function SolveTimer({ problem }: { problem: UserProblemFullClient }) {
  const running = isTimerRunning(problem);
  const nowMs = useNowTick(running, 10);
  const { main, centiseconds } = formatTimer(
    getDisplayedMilliseconds(problem, nowMs),
  );

  return (
    <div className="flex flex-col gap-2.5 border-y bg-background px-6 py-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {running ? (
          <>
            <LiveDot />
            Timer running
          </>
        ) : (
          "Time spent"
        )}
      </div>
      <div
        role="timer"
        className="font-mono text-5xl leading-none font-medium tracking-tight tabular-nums sm:text-6xl"
      >
        {main}
        <span className="text-2xl tracking-normal text-muted-foreground">
          .{centiseconds}
        </span>
      </div>
    </div>
  );
}

function ComplexityField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 font-mono"
      />
    </div>
  );
}
