export default function ResourceDetailLoading() {
  return (
    <div className="grid animate-pulse gap-5">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <div className="h-4 w-36 rounded-full bg-mist" />
        <div className="mt-5 h-10 w-2/3 rounded-full bg-mist/80" />
        <div className="mt-5 h-4 w-full max-w-3xl rounded-full bg-mist" />
        <div className="mt-3 h-4 w-4/5 rounded-full bg-mist" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.95fr]">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            key={`resource-top:${index}`}
            className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
          >
            <div className="h-4 w-24 rounded-full bg-mist" />
            <div className="mt-4 h-8 w-2/5 rounded-full bg-mist/80" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded-full bg-mist" />
              <div className="h-4 w-5/6 rounded-full bg-mist" />
              <div className="h-4 w-3/4 rounded-full bg-mist" />
              <div className="h-24 rounded-[1.4rem] bg-mist/60" />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <article
            key={`resource-section:${index}`}
            className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8"
          >
            <div className="h-4 w-28 rounded-full bg-mist" />
            <div className="mt-4 h-8 w-48 rounded-full bg-mist/80" />
            <div className="mt-6 grid gap-4">
              <div className="h-28 rounded-[1.4rem] bg-mist/60" />
              <div className="h-28 rounded-[1.4rem] bg-mist/60" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
