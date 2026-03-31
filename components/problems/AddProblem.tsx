"use client";

import { useState, type FormEvent } from "react";
import { Plus, LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAddProblemMutation } from "@/hooks/problems/useAddProblemMutation";

export default function AddProblem() {
  const [link, setLink] = useState("");
  const addMutation = useAddProblemMutation();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!link) {
      toast.error("Leetcode problem link required");
      return;
    }
    // TODO: onsuccess clear the input field
    addMutation.mutate({
      problemLink: link,
    });
  }

  return (
    <div>
      <div className="text-lg text-white font-bold mb-2">Add Problem</div>
      <div className="bg-[#282828] p-1 rounded-2xl border border-[#3e3e3e] shadow-xl flex items-center gap-2 focus-within:border-[#ffa116] transition-colors w-80">
        <div className="pl-4 text-gray-500">
          <LinkIcon size={18} />
        </div>
        <form className="flex-1 flex gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Paste LeetCode problem link..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white py-2 placeholder-gray-600"
          />
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="px-4 py-2 rounded-xl flex items-center gap-2 border bg-amber-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </div>
    </div>
  );
}
