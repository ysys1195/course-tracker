import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { ResourceBadges } from '@/components/resource-badges';
import { ResourceStatusForm } from '@/components/resource-status-form';
import { ResourceTagList } from '@/components/resource-tag-list';
import { getResourceDetailForUser } from '@/lib/resource-data';
import { formatUpdatedAt, resourceTypeLabels } from '@/lib/resources';
import { getTagNamesFromResourceTags } from '@/lib/resource-tags';

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

  const tags = getTagNamesFromResourceTags(resource.resourceTags);

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="RESOURCE DETAIL"
        title={resource.title}
        description="教材の基本情報、学習状態、メモ、学習ログ、関連ロードマップを一箇所で確認するための詳細画面です。"
        actions={
          <>
            <Link
              href={`/resources/${resource.id}/edit`}
              className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d3439]"
            >
              編集画面へ
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
            >
              一覧へ戻る
            </Link>
          </>
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
            <div>
              <dt className="text-ink/46">タグ</dt>
              <dd className="mt-3">
                <ResourceTagList tags={tags} />
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

          <div className="mt-6 rounded-[1.25rem] border border-ink/10 bg-white p-4">
            <p className="text-sm font-medium text-ink">ステータス更新</p>
            <p className="mt-2 text-sm leading-7 text-ink/68">
              未着手、学習中、完了、復習中、保留をここから切り替えられます。
            </p>
            <div className="mt-4">
              <ResourceStatusForm
                resourceId={resource.id}
                status={resource.status}
              />
            </div>
          </div>

          <div className="mt-6 rounded-[1.25rem] bg-mist p-4 text-sm leading-7 text-ink/68">
            この教材に紐づく学習メモ、学習ログ、ロードマップを下のセクションで確認できます。
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_1.15fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-signal">NOTES</p>
              <h3 className="mt-2 text-xl font-semibold">学習メモ</h3>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-sm text-ink/68">
              {resource.notes.length}件
            </span>
          </div>

          {resource.notes.length === 0 ? (
            <p className="mt-6 rounded-[1.25rem] bg-mist p-4 text-sm leading-7 text-ink/68">
              メモはまだ登録されていません。後続 issue
              でこの画面からメモを管理できるようにします。
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {resource.notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-[1.25rem] border border-ink/10 bg-mist/40 p-4"
                >
                  <p className="text-sm text-ink/46">
                    更新日: {formatUpdatedAt(note.updatedAt)}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-ink">
                    {note.title || 'タイトル未設定のメモ'}
                  </h4>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/72">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-signal">STUDY LOGS</p>
              <h3 className="mt-2 text-xl font-semibold">学習ログ</h3>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-sm text-ink/68">
              {resource.studyLogs.length}件
            </span>
          </div>

          {resource.studyLogs.length === 0 ? (
            <p className="mt-6 rounded-[1.25rem] bg-mist p-4 text-sm leading-7 text-ink/68">
              学習ログはまだ登録されていません。後続 issue
              でこの教材に対するログ追加機能を実装します。
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {resource.studyLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-[1.25rem] border border-ink/10 bg-mist/40 p-4"
                >
                  <p className="text-sm text-ink/46">
                    {formatUpdatedAt(log.studiedAt)} / {log.type}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/72">
                    {log.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-signal">ROADMAPS</p>
              <h3 className="mt-2 text-xl font-semibold">関連ロードマップ</h3>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-sm text-ink/68">
              {resource.learningPathItems.length}件
            </span>
          </div>

          {resource.learningPathItems.length === 0 ? (
            <p className="mt-6 rounded-[1.25rem] bg-mist p-4 text-sm leading-7 text-ink/68">
              この教材はまだロードマップに含まれていません。
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {resource.learningPathItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.25rem] border border-ink/10 bg-mist/40 p-4"
                >
                  <p className="text-sm text-ink/46">
                    STEP {String(item.position).padStart(2, '0')}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-ink">
                    {item.learningPath.title}
                  </h4>
                  <p className="mt-2 text-sm text-ink/68">
                    ステータス: {item.learningPath.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
