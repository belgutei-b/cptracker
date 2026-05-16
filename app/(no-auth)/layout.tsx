import Footer from "@/components/no-auth/Footer";
import Background from "@/components/no-auth/Background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh relative isolate overflow-hidden bg-neutral-950">
      <Background />
      <div className="relative z-10">
        {children}
        <Footer />
      </div>
    </div>
  );
}
