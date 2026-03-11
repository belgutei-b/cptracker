import Background from "@/components/no-auth/Background";
import Logo from "@/components/no-auth/Logo";

export default function Page() {
  return (
    <main className="relative isolate overflow-hidden bg-neutral-950 text-white min-h-dvh">
      <Background />
      <section className="relative mx-auto max-w-6xl px-6 mt-6 mb-10">
        <Logo />

        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          CPTracker Chrome{" "}
          <span className="bg-linear-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            Extension
          </span>
        </h1>

      </section>
    </main>
  );
}
