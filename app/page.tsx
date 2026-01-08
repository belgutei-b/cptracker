import prisma from "@/lib/prisma";
import { getProblemTags } from "../lib/leetcode";

export default async function Home() {
  // const users = await prisma.user.findMany();
  const problem = await getProblemTags(
    "longest-substring-without-repeating-characters"
  );
  return <div></div>;
}
