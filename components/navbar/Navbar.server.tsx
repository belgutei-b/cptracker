import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const signedIn = !!session?.user?.id;
  return <NavbarClient signedIn={signedIn} />;
}
