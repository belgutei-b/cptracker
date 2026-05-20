import Auth from "@/components/Auth";

export default async function Page() {
  return (
    <div className="min-h-screen mt-4">
      <div className="w-full border-b border-neutral-700" />
      <Auth />
    </div>
  );
}
