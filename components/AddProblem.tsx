"use client";
import { Plus, LinkIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { actionPostProblem } from "../app/dashboard/actions";
import toast from "react-hot-toast";

export default function AddProblem() {
  const [link, setLink] = useState("");

  async function clientAction(formData: FormData) {
    const link = formData.get("link")?.toString();
    if (!link) {
      toast("Leetcode problem link required");
      return;
    }
    const res = await actionPostProblem(link);
    console.log(res);

    toast(res.message);
    if (res.success) {
      setLink("");
    }
  }

  return (
    <div className="bg-[#282828] p-1.5 rounded-2xl border border-[#3e3e3e] shadow-xl flex items-center gap-2 focus-within:border-[#ffa116] transition-colors">
      <div className="pl-4 text-gray-500">
        <LinkIcon size={18} />
      </div>
      <form className="flex-1 flex gap-2" action={clientAction}>
        <input
          type="text"
          value={link}
          name="link"
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste LeetCode link to add problem..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-white py-3 placeholder-gray-600"
        />
        <button
          type="submit"
          className="px-6 rounded-xl flex items-center gap-1 border bg-amber-500 font-medium"
        >
          <Plus size={16} className="mr-1" /> Add
        </button>
      </form>
    </div>
  );
}
