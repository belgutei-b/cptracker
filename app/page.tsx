import { getUserCount } from "@/lib/tmp";

export default async function Home() {
  let userCount: number | null = null;
  let userCountFailed = false;

  try {
    userCount = await getUserCount();
  } catch {
    userCountFailed = true;
  }

  if (userCountFailed) return <div className="text-white">Users: failed</div>;

  return <div className="text-white">Users: {userCount}</div>;
}
