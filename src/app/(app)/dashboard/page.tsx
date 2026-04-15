import Link from 'next/link';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { ResourceBadges } from '@/components/resource-badges';
import { ResourceEmptyState } from '@/components/resource-empty-state';
import {
  getDashboardDataForUser,
  type DashboardFocusResource,
} from '@/lib/dashboard-data';
import { formatUpdatedAt, resourceTypeLabels } from '@/lib/resources';

function FocusResourceCard({
  resource,
  caption,
}: {
  resource: DashboardFocusResource;
  caption: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm tracking-[0.12em] text-signal">
            {resourceTypeLabels[resource.type]}
          </p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink sm:text-xl">
            {resource.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink/62">{caption}</p>
        </div>
        <Link
          href={`/resources/${resource.id}`}
          className="inline-flex w-full shrink-0 items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink sm:w-auto"
        >
          詳細
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ResourceBadges status={resource.status} priority={resource.priority} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {resource.tagNames.length > 0 ? (
          resource.tagNames.slice(0, 3).map((tagName) => (
            <span
              key={tagName}
              className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm text-ink/68"
            >
              {tagName}
            </span>
          ))
        ) : (
          <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm text-ink/52">
            タグ未設定
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-ink/8 pt-4 text-sm text-ink/62 sm:flex-row sm:items-center sm:justify-between">
        <p>更新日: {formatUpdatedAt(resource.updatedAt)}</p>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="text-signal underline-offset-4 hover:underline"
        >
          外部URL
        </a>
      </div>
    </article>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const {
    inProgressResources,
    highPriorityResources,
    weeklyResources,
    statusSummary,
    typeSummary,
  } = await getDashboardDataForUser(session.user.id);

  const totalCount = statusSummary.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow="DASHBOARD"
        title={`${session.user.name || 'ユーザー'}の学習ワークスペース`}
        description="学習中の教材、優先度、今週の更新をまとめて確認できます。次に見る教材へすぐ移れるダッシュボードです。"
        variant="hero"
        actions={
          <>
            <Link
              href="/resources"
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-white/90 sm:w-auto"
            >
              教材一覧を見る
            </Link>
            <Link
              href="/resources/new"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto"
            >
              教材を追加
            </Link>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm tracking-[0.18em] text-signal">STATUS</p>
              <h2 className="mt-2 text-[1.45rem] font-semibold leading-none text-ink sm:text-[1.75rem]">
                ステータス別件数
              </h2>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink/68">
              合計 {totalCount}件
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {statusSummary.map((item) => (
              <article
                key={item.key}
                className={`rounded-[1.35rem] border px-4 py-4 ${item.tone}`}
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold">{item.value}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm tracking-[0.18em] text-signal">TYPES</p>
              <h2 className="mt-2 text-[1.45rem] font-semibold leading-none text-ink sm:text-[1.75rem]">
                種別別件数
              </h2>
            </div>
            <Link
              href="/resources"
              className="text-sm text-signal underline-offset-4 hover:underline"
            >
              一覧で確認
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            {typeSummary.map((item) => (
              <div
                key={item.key}
                className={`flex items-center justify-between rounded-[1.2rem] border px-4 py-3 ${item.tone}`}
              >
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm tracking-[0.18em] text-signal">
                IN PROGRESS
              </p>
              <h2 className="mt-2 text-[1.45rem] font-semibold leading-none text-ink sm:text-[1.75rem]">
                学習中の教材
              </h2>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink/68">
              {inProgressResources.length}件
            </span>
          </div>

          {inProgressResources.length === 0 ? (
            <div className="mt-6">
              <ResourceEmptyState
                title="学習中の教材はまだありません"
                description="教材一覧からステータスを学習中に切り替えると、次に進める教材がここにまとまります。"
                ctaLabel="教材一覧を開く"
                ctaHref="/resources"
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {inProgressResources.map((resource) => (
                <FocusResourceCard
                  key={resource.id}
                  resource={resource}
                  caption={
                    resource.latestStudyLog
                      ? `${formatUpdatedAt(resource.latestStudyLog.studiedAt)}に${resource.latestStudyLog.studyMinutes}分学習`
                      : '進行中の教材として追跡中'
                  }
                />
              ))}
            </div>
          )}
        </article>

        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm tracking-[0.18em] text-signal">NEXT UP</p>
              <h2 className="mt-2 text-[1.45rem] font-semibold leading-none text-ink sm:text-[1.75rem]">
                優先度が高い教材
              </h2>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink/68">
              {highPriorityResources.length}件
            </span>
          </div>

          {highPriorityResources.length === 0 ? (
            <div className="mt-6">
              <ResourceEmptyState
                title="高優先度の教材はありません"
                description="教材編集から優先度を高にすると、次に見る候補がここに出ます。"
                ctaLabel="教材を追加"
                ctaHref="/resources/new"
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {highPriorityResources.map((resource) => (
                <FocusResourceCard
                  key={resource.id}
                  resource={resource}
                  caption={
                    resource.status === 'IN_PROGRESS'
                      ? '今すぐ続きに戻れる教材'
                      : '次に着手する候補として優先度が高い教材'
                  }
                />
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.18em] text-signal">THIS WEEK</p>
            <h2 className="mt-2 text-[1.45rem] font-semibold leading-none text-ink sm:text-[1.75rem]">
              今週更新した教材とログ
            </h2>
          </div>
          <span className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink/68">
            {weeklyResources.length}件
          </span>
        </div>

        {weeklyResources.length === 0 ? (
          <p className="mt-6 rounded-[1.15rem] bg-mist px-4 py-3 text-sm leading-7 text-ink/68">
            今週の更新はまだありません。教材情報を編集したり学習ログを追加すると、ここに最新の動きが表示されます。
          </p>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {weeklyResources.map((resource) => (
              <article
                key={`${resource.id}:${resource.activityDate.toISOString()}`}
                className="rounded-[1.4rem] border border-ink/10 bg-mist/40 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm tracking-[0.12em] text-signal">
                      {resourceTypeLabels[resource.type]}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink sm:text-xl">
                      {resource.title}
                    </h3>
                  </div>
                  <Link
                    href={`/resources/${resource.id}`}
                    className="inline-flex w-full shrink-0 items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-white hover:text-ink sm:w-auto"
                  >
                    詳細
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full border border-ink/10 bg-white px-3 py-1 text-sm font-medium text-ink/68">
                    {resource.activityLabel}
                  </span>
                  <span className="inline-flex rounded-full border border-ink/10 bg-white px-3 py-1 text-sm text-ink/62">
                    {formatUpdatedAt(resource.activityDate)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ResourceBadges
                    status={resource.status}
                    priority={resource.priority}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
