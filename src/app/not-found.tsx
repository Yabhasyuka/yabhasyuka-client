import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-bone px-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">404</p>
        <h1 className="font-display mt-4 text-4xl text-ink md:text-6xl">
          This room doesn&apos;t exist.
        </h1>
        <p className="mt-4 text-ink-soft">
          The page you&apos;re looking for has drifted away.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-bone transition-colors hover:bg-clay"
        >
          Back to the spa
        </Link>
      </div>
    </main>
  );
}
