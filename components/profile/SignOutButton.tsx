"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSignOut = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await signOut();
      // forget the synced timezone so the next account syncs its own
      localStorage.removeItem("tz");
      router.replace("/auth");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={onSignOut} disabled={isLoading}>
      <LogOut />
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
