import { getSession } from "../lib/session";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getSession();
  const signedIn = !!session?.userId;

  return <NavbarClient signedIn={signedIn} />;
}
