import Link from 'next/link';
import { ResourceFiltersResetButton } from '@/components/resource-filters-reset-button';
import type { ResourceListFilters } from '@/lib/resources';
import {
  resourcePriorityOptions,
  resourceSortOptions,
  resourceStatusOptions,
  resourceTypeOptions,
} from '@/lib/resources';

type ResourceFiltersBarProps = {
  filters: ResourceListFilters;
  resultCount: number;
};

export function ResourceFiltersBar({
  filters,
  resultCount,
}: ResourceFiltersBarProps) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm tracking-[0.18em] text-signal">FILTERS</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
            検索・絞り込み
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:leading-7">
            タイトルと条件を組み合わせて、今見る教材を絞り込めます。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="rounded-full bg-mist px-4 py-2 text-sm text-ink/70">
            表示件数:{' '}
            <span className="font-semibold text-ink">{resultCount}</span>
          </div>
          <Link
            href="/resources/new"
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d3439] sm:w-auto"
          >
            教材を追加する
          </Link>
        </div>
      </div>

      <form method="get" className="mt-6 grid gap-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(16rem,1fr)]">
          <label className="grid gap-2 text-sm text-ink/72">
            <span className="font-medium text-ink">タイトル検索</span>
            <input
              type="search"
              name="q"
              defaultValue={filters.q}
              placeholder="例: Next.js"
              className="rounded-2xl border border-ink/12 bg-white px-4 py-3 outline-none transition focus:border-signal"
            />
          </label>

          <label className="grid gap-2 text-sm text-ink/72">
            <span className="font-medium text-ink">並び順</span>
            <select
              name="sort"
              defaultValue={filters.sort}
              className="rounded-2xl border border-ink/12 bg-white px-4 py-3 outline-none transition focus:border-signal"
            >
              {resourceSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
          <label className="grid gap-2 text-sm text-ink/72">
            <span className="font-medium text-ink">種別</span>
            <select
              name="type"
              defaultValue={filters.type ?? ''}
              className="rounded-2xl border border-ink/12 bg-white px-4 py-3 outline-none transition focus:border-signal"
            >
              <option value="">すべて</option>
              {resourceTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-ink/72">
            <span className="font-medium text-ink">ステータス</span>
            <select
              name="status"
              defaultValue={filters.status ?? ''}
              className="rounded-2xl border border-ink/12 bg-white px-4 py-3 outline-none transition focus:border-signal"
            >
              <option value="">すべて</option>
              {resourceStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-ink/72">
            <span className="font-medium text-ink">優先度</span>
            <select
              name="priority"
              defaultValue={filters.priority ?? ''}
              className="rounded-2xl border border-ink/12 bg-white px-4 py-3 outline-none transition focus:border-signal"
            >
              <option value="">すべて</option>
              {resourcePriorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 self-end sm:grid-cols-2 xl:min-w-[14rem] xl:grid-cols-1">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439]"
            >
              条件を適用
            </button>
            <ResourceFiltersResetButton />
          </div>
        </div>
      </form>
    </section>
  );
}
