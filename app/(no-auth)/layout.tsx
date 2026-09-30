import Footer from "@/components/no-auth/Footer";
import PublicNavbar from "@/components/no-auth/PublicNavbar";
import { getSession } from "@/lib/session";

/**
 * Layout for public pages: landing, extension, legal pages and sign in
 */
export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicNavbar isSignedIn={!!session} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
