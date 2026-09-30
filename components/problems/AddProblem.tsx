"use client";

import { useState, type FormEvent } from "react";
import { LinkIcon, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddProblemMutation } from "@/hooks/problems/useAddProblemMutation";

export default function AddProblem() {
  const [link, setLink] = useState("");
  const addMutation = useAddProblemMutation();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!link.trim()) {
      toast.error("Leetcode problem link required");
      return;
    }

    addMutation.mutate(
      { problemLink: link.trim() },
      { onSuccess: () => setLink("") },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Add problem"
      className="flex w-full items-center gap-2 md:w-auto"
    >
      <div className="relative flex-1 md:w-96 md:flex-none">
        <LinkIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          inputMode="url"
          aria-label="LeetCode problem link"
          placeholder="Paste a LeetCode problem link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="h-9 pl-9"
        />
      </div>
      <Button type="submit" size="lg" disabled={addMutation.isPending}>
        <Plus />
        <span className="sr-only sm:not-sr-only">Add problem</span>
      </Button>
    </form>
  );
}
