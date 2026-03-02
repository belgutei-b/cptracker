import NavbarClient from "@/components/navbar/NavbarClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavbarClient />
      {children}
    </div>
  );
}
