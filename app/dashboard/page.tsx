import { redirect } from "next/navigation";
import AddProblem from "../../components/AddProblem";
import { getProblems } from "../../lib/problem";
import { getSession } from "../../lib/session";
import DashboardProblems from "../../components/Problems";

export default async function Page() {
  const session = await getSession();
  const userId = session?.userId as string;
  if (!session || !userId) {
    redirect("/auth/sign-in");
  }
  const problems = await getProblems({ userId });
  if (!problems) {
    return <div>Error fetching problems</div>;
  }
  console.log(problems);

  return (
    <div className="w-full flex flex-col lg:flex-row-reverse px-4 gap-3">
      <div className="flex-1 mt-5 md:mt-10">
        <AddProblem />
      </div>
      <div className="w-full lg:w-5/8 mt-5">
        <div className="text-lg text-white font-bold mb-5">My Dashboard</div>
        <DashboardProblems receivedProblems={problems} />
      </div>
    </div>
  );
}
