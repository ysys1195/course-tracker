export default function PathDetailLoading() {
  return (
    <div className="grid animate-pulse gap-5">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <div className="h-4 w-24 rounded-full bg-mist" />
        <div className="mt-5 h-10 w-2/3 rounded-full bg-mist/80" />
        <div className="mt-5 h-4 w-full max-w-3xl rounded-full bg-mist" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="h-4 w-24 rounded-full bg-mist" />
          <div className="mt-4 h-8 w-40 rounded-full bg-mist/80" />
          <div className="mt-6 h-52 rounded-[1.4rem] bg-mist/60" />
          <div className="mt-6 flex gap-3">
            <div className="h-8 w-24 rounded-full bg-mist" />
            <div className="h-8 w-24 rounded-full bg-mist" />
            <div className="h-8 w-24 rounded-full bg-mist" />
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="h-4 w-32 rounded-full bg-mist" />
          <div className="mt-4 h-8 w-40 rounded-full bg-mist/80" />
          <div className="mt-6 h-12 rounded-[1.1rem] bg-mist" />
          <div className="mt-4 h-24 rounded-[1.1rem] bg-mist" />
          <div className="mt-5 flex justify-end">
            <div className="h-11 w-32 rounded-full bg-mist/80" />
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="h-4 w-20 rounded-full bg-mist" />
        <div className="mt-4 h-8 w-36 rounded-full bg-mist/80" />
        <div className="mt-6 grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`path-item:${index}`}
              className="h-40 rounded-[1.4rem] bg-mist/60"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
