import { getUser } from "@/lib/user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>Login first</div>;
  }

  const user = await getUser({ userId: session.user.id });
  console.log(user);

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="text-xl text-white font-bold">Profile & Analytics</div>
    </div>
  );
}
