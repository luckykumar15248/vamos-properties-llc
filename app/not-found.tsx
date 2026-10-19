import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24">
      <h1 className="font-serif text-4xl text-ink">That page is not here</h1>
      <p className="mt-4 leading-7 text-muted">
        The address may have changed. You can go back to the home page and tell us about the house.
      </p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-pine">
        Back to Vamos
      </Link>
    </main>
  );
}
