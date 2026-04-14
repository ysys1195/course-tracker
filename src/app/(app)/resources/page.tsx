import Link from 'next/link';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { ResourceCard } from '@/components/resource-card';
import { ResourceEmptyState } from '@/components/resource-empty-state';
import { getResourcesForUser } from '@/lib/resource-data';

export default async function ResourcesPage() {
  const session = await auth();

  const resources = session?.user?.id
    ? await getResourcesForUser(session.user.id)
    : [];

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="RESOURCES"
        title="教材一覧"
        description="公式 Docs、GitHub、動画、書籍、記事をユーザー単位で管理する中心画面です。今回は一覧表示、視認しやすい状態表示、詳細導線までを整えています。"
        actions={
          <>
            <div className="rounded-[1.25rem] bg-mist px-4 py-3 text-sm text-ink/68">
              登録件数:{' '}
              <span className="font-semibold text-ink">{resources.length}</span>
            </div>
            <Link
              href="/resources/new"
              className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d3439]"
            >
              教材を追加する
            </Link>
          </>
        }
      />

      {resources.length === 0 ? (
        <ResourceEmptyState
          title="まだ教材が登録されていません"
          description="最初の教材を登録すると、この画面から種別、ステータス、優先度をまとめて確認できるようになります。"
          ctaLabel="最初の教材を登録する"
        />
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
