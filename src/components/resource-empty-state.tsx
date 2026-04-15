import Link from 'next/link';

type ResourceEmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ResourceEmptyState({
  title,
  description,
  ctaLabel,
  ctaHref = '/resources/new',
}: ResourceEmptyStateProps) {
  return (
    <section className="rounded-[1.75rem] border border-dashed border-ink/20 bg-white/80 p-8 shadow-soft">
      <p className="text-sm tracking-[0.18em] text-signal">EMPTY STATE</p>
      <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
        {description}
      </p>
      {ctaLabel ? (
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </section>
  );
}
