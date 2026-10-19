export function ListingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16" aria-hidden="true">
      <div className="h-10 w-56 animate-pulse bg-mist motion-reduce:animate-none" />
      <div className="mt-8 h-40 animate-pulse bg-mist motion-reduce:animate-none" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-72 animate-pulse bg-mist motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}
