"use client";
import { Plus, LinkIcon } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { actionPostProblem } from "@/app/dashboard/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddProblem() {
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!link) {
      toast.error("Leetcode problem link required");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await actionPostProblem(link);

      if (res.success) {
        toast.success(res.message);
        setLink("");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Unexpected Error Occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-[#282828] p-1 rounded-2xl border border-[#3e3e3e] shadow-xl flex items-center gap-2 focus-within:border-[#ffa116] transition-colors w-80">
      <div className="pl-4 text-gray-500">
        <LinkIcon size={18} />
      </div>
      <form className="flex-1 flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste LeetCode link to add problem..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-white py-2 placeholder-gray-600"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl flex items-center gap-2 border bg-amber-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> Add
        </button>
      </form>
    </div>
  );
}
