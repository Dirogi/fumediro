import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-start justify-center gap-4 px-4 sm:px-8">
      <h1 className="font-display text-4xl">Página no encontrada</h1>
      <Link href="/" className="underline underline-offset-4">Volver al inicio</Link>
    </main>
  );
}
