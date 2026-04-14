import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { ResourceBadges } from '@/components/resource-badges';
import { getResourceDetailForUser } from '@/lib/resource-data';
import { formatUpdatedAt, resourceTypeLabels } from '@/lib/resources';

type ResourceDetailPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;

  const resource = await getResourceDetailForUser(session.user.id, id);

  if (!resource) {
    notFound();
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="RESOURCE DETAIL"
        title={resource.title}
        description="教材の基本情報を確認するための最小詳細画面です。メモや学習ログの詳細領域は後続 issue で追加します。"
        actions={
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            一覧へ戻る
          </Link>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm text-signal">基本情報</p>
          <dl className="mt-5 grid gap-5 text-sm text-ink/74">
            <div>
              <dt className="text-ink/46">提供元</dt>
              <dd className="mt-2 text-base font-medium text-ink">
                {resource.provider}
              </dd>
            </div>
            <div>
              <dt className="text-ink/46">教材種別</dt>
              <dd className="mt-2 text-base font-medium text-ink">
                {resourceTypeLabels[resource.type]}
              </dd>
            </div>
            <div>
              <dt className="text-ink/46">外部URL</dt>
              <dd className="mt-2 break-all">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-signal underline-offset-4 hover:underline"
                >
                  {resource.url}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink/46">更新日</dt>
              <dd className="mt-2">{formatUpdatedAt(resource.updatedAt)}</dd>
            </div>
            <div>
              <dt className="text-ink/46">説明</dt>
              <dd className="mt-2 whitespace-pre-wrap leading-7">
                {resource.description || '説明はまだ登録されていません。'}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm text-signal">学習状態</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ResourceBadges
              status={resource.status}
              priority={resource.priority}
              showStatusPrefix
            />
          </div>
          <div className="mt-6 rounded-[1.25rem] bg-mist p-4 text-sm leading-7 text-ink/68">
            メモ一覧、学習ログ、関連ロードマップは後続 issue でこの画面に追加します。
          </div>
        </article>
      </section>
    </div>
  );
}
