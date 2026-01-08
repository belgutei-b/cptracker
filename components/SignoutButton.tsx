"use client";

import { handleLogout } from "../app/profile/action";

export default function SignoutButton() {
  return <button onClick={handleLogout}></button>;
}
