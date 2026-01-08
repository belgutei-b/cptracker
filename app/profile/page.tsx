import { deleteSession, getSession } from "../../lib/session";
import { getUser } from "../../lib/user";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    return <div>Login first</div>;
  }

  const user = await getUser({ userId: session.userId as string });
  console.log(user);

  async function actionLogout() {
    await deleteSession();
  }

  return <div>{user?.username}</div>;
}
