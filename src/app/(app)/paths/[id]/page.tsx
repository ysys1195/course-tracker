import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { ResourceBadges } from '@/components/resource-badges';
import { ResourceTagList } from '@/components/resource-tag-list';
import {
  addResourceToLearningPath,
  deleteLearningPath,
  moveLearningPathItem,
  removeLearningPathItem,
} from '@/app/(app)/paths/[id]/actions';
import {
  getAvailableResourcesForLearningPath,
  getLearningPathDetailForUser,
  getLearningPathProgress,
  getLearningPathStatusBreakdown,
  getPathTagNames,
  learningPathStatusMeta,
} from '@/lib/path-data';
import { initialAddPathItemFormState } from '@/lib/path-item-form';
import { formatUpdatedAt, resourceTypeLabels } from '@/lib/resources';
import { MoveItemButton } from './move-item-button';
import { PathItemForm } from './path-item-form';

type PathDetailPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function PathDetailPage({ params }: PathDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;
  const [learningPath, availableResources] = await Promise.all([
    getLearningPathDetailForUser(session.user.id, id),
    getAvailableResourcesForLearningPath(session.user.id, id),
  ]);

  if (!learningPath) {
    notFound();
  }

  const statusMeta = learningPathStatusMeta[learningPath.status];
  const progress = getLearningPathProgress(learningPath.items);
  const breakdown = getLearningPathStatusBreakdown(learningPath.items);

  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow="PATH DETAIL"
        title={learningPath.title}
        description={
          learningPath.description ||
          'ロードマップの説明はまだ登録されていません。'
        }
        actions={
          <>
            <Link
              href="/paths"
              className="inline-flex w-full items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink sm:w-auto"
            >
              一覧へ戻る
            </Link>
            <Link
              href={`/paths/${learningPath.id}/edit`}
              className="inline-flex w-full items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink sm:w-auto"
            >
              編集する
            </Link>
            <span
              className={`inline-flex w-full items-center justify-center rounded-full border px-4 py-2 text-sm font-medium sm:w-auto ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
          </>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm tracking-[0.18em] text-signal">PROGRESS</p>
          <h2 className="mt-2 text-[1.45rem] font-semibold leading-none text-ink sm:text-[1.75rem]">
            ロードマップ進捗
          </h2>

          <div className="mt-6 rounded-[1.4rem] bg-mist/60 p-5">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-4xl font-semibold text-ink">
                {progress.completionRate}%
              </p>
              <p className="pb-1 text-sm text-ink/68">
                {progress.completedCount}/{progress.totalCount} 件完了
              </p>
            </div>

            <div className="mt-4 h-3 rounded-full bg-white">
              <div
                className="h-3 rounded-full bg-ink transition-[width]"
                style={{ width: `${progress.completionRate}%` }}
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.15rem] bg-white px-4 py-3">
                <p className="text-sm text-ink/52">完了</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {progress.completedCount}
                </p>
              </div>
              <div className="rounded-[1.15rem] bg-white px-4 py-3">
                <p className="text-sm text-ink/52">進行中</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {progress.inProgressCount}
                </p>
              </div>
              <div className="rounded-[1.15rem] bg-white px-4 py-3">
                <p className="text-sm text-ink/52">残り</p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {progress.remainingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {breakdown.length > 0 ? (
              breakdown.map((item) => (
                <span
                  key={item.status}
                  className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${item.className}`}
                >
                  {item.label}: {item.count}
                </span>
              ))
            ) : (
              <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm text-ink/68">
                まだ教材が追加されていません
              </span>
            )}
          </div>

          <div className="mt-6 border-t border-ink/8 pt-4 text-sm text-ink/62">
            更新日: {formatUpdatedAt(learningPath.updatedAt)}
          </div>
        </article>

        <PathItemForm
          action={addResourceToLearningPath.bind(null, learningPath.id)}
          initialState={initialAddPathItemFormState}
          resources={availableResources}
        />
      </section>

      <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.18em] text-signal">ITEMS</p>
            <h2 className="mt-2 text-[1.45rem] font-semibold leading-none text-ink sm:text-[1.75rem]">
              教材一覧
            </h2>
          </div>
          <span className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink/68">
            {learningPath.items.length}件
          </span>
        </div>

        {learningPath.items.length === 0 ? (
          <p className="mt-6 rounded-[1.15rem] bg-mist px-4 py-3 text-sm leading-7 text-ink/68">
            まだ教材が追加されていません。上のフォームから教材を追加すると、学習順にここへ並びます。
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {learningPath.items.map((item) => {
              const tags = getPathTagNames(item.resource.resourceTags);
              const isFirst = item.position === 1;
              const isLast = item.position === learningPath.items.length;

              return (
                <article
                  key={item.id}
                  className="rounded-[1.4rem] border border-ink/10 bg-mist/40 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm tracking-[0.14em] text-signal">
                        STEP {String(item.position).padStart(2, '0')} /{' '}
                        {resourceTypeLabels[item.resource.type]}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                        {item.resource.title}
                      </h3>
                    </div>
                    <div className="grid shrink-0 gap-2 sm:flex sm:flex-wrap">
                      <form
                        action={moveLearningPathItem.bind(
                          null,
                          learningPath.id,
                          item.id,
                          'up'
                        )}
                      >
                        <MoveItemButton direction="up" disabled={isFirst} />
                      </form>
                      <form
                        action={moveLearningPathItem.bind(
                          null,
                          learningPath.id,
                          item.id,
                          'down'
                        )}
                      >
                        <MoveItemButton direction="down" disabled={isLast} />
                      </form>
                      <Link
                        href={`/resources/${item.resource.id}`}
                        className="inline-flex w-full items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-white hover:text-ink sm:w-auto"
                      >
                        教材詳細
                      </Link>
                      <details className="w-full sm:w-auto">
                        <summary className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-rose-200 bg-white px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-50 sm:w-auto">
                          項目を削除
                        </summary>
                        <form
                          action={removeLearningPathItem.bind(
                            null,
                            learningPath.id,
                            item.id
                          )}
                          className="mt-3 grid gap-3 rounded-[1.15rem] border border-rose-200 bg-white p-4"
                        >
                          <label className="flex items-start gap-3 text-sm text-ink/72">
                            <input
                              type="checkbox"
                              required
                              className="mt-1 h-4 w-4 rounded border-ink/20 text-rose-700 focus:ring-rose-600"
                            />
                            <span>
                              この項目だけをロードマップから外し、教材自体は削除されないことを確認しました。
                            </span>
                          </label>
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full bg-rose-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-800"
                          >
                            項目を削除する
                          </button>
                        </form>
                      </details>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ResourceBadges
                      status={item.resource.status}
                      priority={item.resource.priority}
                    />
                  </div>

                  {item.note ? (
                    <p className="mt-4 text-sm leading-7 text-ink/72">
                      {item.note}
                    </p>
                  ) : null}

                  <div className="mt-4">
                    <ResourceTagList
                      tags={tags}
                      emptyLabel="この教材にはタグがまだ設定されていません。"
                    />
                  </div>

                  <div className="mt-5 border-t border-ink/8 pt-4 text-sm text-ink/62">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                      <p>更新日: {formatUpdatedAt(item.resource.updatedAt)}</p>
                      <p>並び順はリロード後も保持されます</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50/70 p-5">
        <p className="text-sm tracking-[0.18em] text-rose-700">DANGER ZONE</p>
        <h2 className="mt-3 text-lg font-semibold text-ink">
          ロードマップを削除する
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink/72">
          この操作は取り消せません。削除するとロードマップ本体と、紐づく教材順序がまとめて削除されます。教材自体は削除されません。
        </p>

        <details className="mt-5 rounded-[1.25rem] border border-rose-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium text-rose-700">
            削除確認を開く
          </summary>

          <form
            action={deleteLearningPath.bind(null, learningPath.id)}
            className="mt-4 grid gap-4"
          >
            <label className="flex items-start gap-3 text-sm text-ink/72">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-ink/20 text-rose-700 focus:ring-rose-600"
              />
              <span>
                このロードマップを削除し、元に戻せないことを確認しました。
              </span>
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-rose-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-800 sm:w-fit"
            >
              ロードマップを削除する
            </button>
          </form>
        </details>
      </section>
    </div>
  );
}
