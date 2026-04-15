import { auth } from '@/auth';
import { ActiveResourceFilters } from '@/components/active-resource-filters';
import { PageHeader } from '@/components/page-header';
import { ResourceCard } from '@/components/resource-card';
import { ResourceEmptyState } from '@/components/resource-empty-state';
import { ResourceFiltersBar } from '@/components/resource-filters-bar';
import { getResourcesForUser } from '@/lib/resource-data';
import {
  getActiveResourceFilterChips,
  parseResourceListFilters,
  type ResourceListSearchParams,
} from '@/lib/resources';

type ResourcesPageProps = Readonly<{
  searchParams?: Promise<ResourceListSearchParams>;
}>;

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const session = await auth();
  const filters = parseResourceListFilters(await searchParams);
  const activeFilters = getActiveResourceFilterChips(filters);

  const resources = session?.user?.id
    ? await getResourcesForUser(session.user.id, filters)
    : [];
  const hasAnyFilters = activeFilters.length > 0;

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="RESOURCES"
        title="教材一覧"
        description="タイトル検索、種別、ステータス、優先度、並び順を組み合わせて、学習リソースを探しやすく整理できます。"
      />

      <ResourceFiltersBar filters={filters} resultCount={resources.length} />

      <ActiveResourceFilters filters={activeFilters} clearHref="/resources" />

      {resources.length === 0 ? (
        hasAnyFilters ? (
          <ResourceEmptyState
            title="条件に一致する教材がありません"
            description="検索語や絞り込み条件を見直すと、別の教材が見つかる可能性があります。現在の条件は上のチップから確認できます。"
          />
        ) : (
          <ResourceEmptyState
            title="まだ教材が登録されていません"
            description="最初の教材を登録すると、この画面から種別、ステータス、優先度をまとめて確認できるようになります。"
            ctaLabel="最初の教材を登録する"
          />
        )
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </section>
      )}
    </div>
  );
}
