import { getProblems } from "@/lib/problem";
import ProblemListClient from "@/components/problems/ProblemsList.client";

export default async function ProblemListServer({
  userId,
}: {
  userId: string;
}) {
  const problems = await getProblems({ userId });
  return <ProblemListClient receivedProblems={problems} />;
}
