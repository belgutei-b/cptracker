import Footer from "@/components/no-auth/Footer";
import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-dvh relative isolate overflow-hidden bg-neutral-950">
      <Background />
      <div className="relative z-10">
        {/* Nav */}
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
          <Logo className="mb-0!" />

          {session ? (
            <Link
              href="/dashboard"
              className="landing-button landing-button-orange whitespace-nowrap"
            >
              Dashboard
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              href="/auth"
              className="landing-button landing-button-orange whitespace-nowrap"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          )}
        </nav>
        {children}
        <Footer />
      </div>
    </div>
  );
}
