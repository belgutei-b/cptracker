import { Inter } from "next/font/google";
import Logo from "@/components/no-auth/Logo";
import ExtensionBody from "@/components/extension/ExtensionBody";

const inter = Inter({ subsets: ["latin"] });

/**
 * Extension page for unauthenticated users
 * This page is added to keep navbar consistency
 */
export default function Page() {
  return (
    <main
      className={`${inter.className} text-white min-h-dvh`}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-6">
        <Logo className="mb-0!" />
      </div>

      <ExtensionBody isAuth={false} />
    </main>
  );
}
