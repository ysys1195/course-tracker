import Link from 'next/link';

type ActiveResourceFiltersProps = {
  filters: Array<{
    key: string;
    label: string;
    value: string;
  }>;
  clearHref: string;
};

export function ActiveResourceFilters({
  filters,
  clearHref,
}: ActiveResourceFiltersProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1.5rem] border border-ink/10 bg-white/85 p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink">現在の条件</p>
          <p className="mt-1 text-sm leading-6 text-ink/68">
            選択中の検索・絞り込み条件です。
          </p>
        </div>
        <Link
          href={clearHref}
          className="text-sm text-signal underline-offset-4 hover:underline"
        >
          条件をクリア
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <span
            key={filter.key}
            className="inline-flex items-center rounded-full border border-ink/10 bg-mist px-3 py-1.5 text-sm text-ink/72"
          >
            <span className="font-medium text-ink">{filter.label}:</span>
            <span className="ml-1">{filter.value}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
