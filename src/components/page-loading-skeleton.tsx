type PageLoadingSkeletonProps = {
  eyebrow: string;
  titleWidth?: string;
  descriptionWidth?: string;
  cardCount?: number;
};

export function PageLoadingSkeleton({
  eyebrow,
  titleWidth = 'w-72',
  descriptionWidth = 'w-full max-w-2xl',
  cardCount = 3,
}: PageLoadingSkeletonProps) {
  return (
    <div className="grid animate-pulse gap-5">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <div className="h-4 w-28 rounded-full bg-mist" />
        <div className={`mt-5 h-10 rounded-full bg-mist/80 ${titleWidth}`} />
        <div className={`mt-5 h-4 rounded-full bg-mist ${descriptionWidth}`} />
        <div className="mt-3 h-4 w-4/5 rounded-full bg-mist" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: cardCount }).map((_, index) => (
          <article
            key={`${eyebrow}:${index}`}
            className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
          >
            <div className="h-4 w-24 rounded-full bg-mist" />
            <div className="mt-4 h-8 w-2/3 rounded-full bg-mist/80" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded-full bg-mist" />
              <div className="h-4 w-5/6 rounded-full bg-mist" />
              <div className="h-4 w-3/4 rounded-full bg-mist" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
