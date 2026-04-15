import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { ResourceEmptyState } from '@/components/resource-empty-state';
import { createLearningPath } from '@/app/(app)/paths/actions';
import {
  getLearningPathProgress,
  getLearningPathsForUser,
  learningPathStatusMeta,
} from '@/lib/path-data';
import { initialLearningPathFormState } from '@/lib/path-form';
import { formatUpdatedAt } from '@/lib/resources';
import { LearningPathForm } from './path-form';

export default async function PathsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const learningPaths = await getLearningPathsForUser(session.user.id);

  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow="PATHS"
        title="学習ロードマップ"
        description="学習の目的ごとに教材をまとめ、順番と進捗を一目で把握できる画面です。教材単体の管理から一歩進めて、学習の流れを組み立てます。"
        actions={
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            教材一覧を見る
          </Link>
        }
      />

      <LearningPathForm
        action={createLearningPath}
        initialState={initialLearningPathFormState}
        submitLabel="ロードマップを作成"
        pendingLabel="作成中..."
      />

      {learningPaths.length === 0 ? (
        <ResourceEmptyState
          title="ロードマップはまだありません"
          description="学習テーマごとに教材をまとめると、次に何を見るかとどこまで進んだかを整理できます。まずは1つ作成してみてください。"
        />
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {learningPaths.map((learningPath) => {
            const progress = getLearningPathProgress(learningPath.items);
            const statusMeta = learningPathStatusMeta[learningPath.status];

            return (
              <article
                key={learningPath.id}
                className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm tracking-[0.18em] text-signal">
                      PATH
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                      {learningPath.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-ink/68">
                      {learningPath.description ||
                        '説明はまだ登録されていません。'}
                    </p>
                  </div>
                  <Link
                    href={`/paths/${learningPath.id}`}
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
                  >
                    詳細を見る
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${statusMeta.className}`}
                  >
                    {statusMeta.label}
                  </span>
                  <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm text-ink/68">
                    教材 {progress.totalCount}件
                  </span>
                  <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm text-ink/68">
                    完了率 {progress.completionRate}%
                  </span>
                </div>

                <div className="mt-5 rounded-[1.25rem] bg-mist/60 p-4">
                  <div className="h-2 rounded-full bg-white">
                    <div
                      className="h-2 rounded-full bg-ink transition-[width]"
                      style={{ width: `${progress.completionRate}%` }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink/68">
                    <p>完了 {progress.completedCount}件</p>
                    <p>進行中 {progress.inProgressCount}件</p>
                    <p>残り {progress.remainingCount}件</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-ink/8 pt-4 text-sm text-ink/62">
                  更新日: {formatUpdatedAt(learningPath.updatedAt)}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
