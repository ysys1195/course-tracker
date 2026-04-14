import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  formatUpdatedAt,
  resourcePriorityMeta,
  resourceStatusMeta,
  resourceTypeLabels,
} from "@/lib/resources";

export default async function ResourcesPage() {
  const session = await auth();

  const resources = session?.user?.id
    ? await prisma.learningResource.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          priority: true,
          updatedAt: true,
          url: true,
        },
      })
    : [];

  return (
    <div className="grid gap-4">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] text-signal">RESOURCES</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">教材一覧</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
              公式 Docs、GitHub、動画、書籍、記事をユーザー単位で管理する中心画面です。今回は一覧表示、視認しやすい状態表示、詳細導線までを整えています。
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-mist px-4 py-3 text-sm text-ink/68">
            登録件数: <span className="font-semibold text-ink">{resources.length}</span>
          </div>
        </div>
      </section>

      {resources.length === 0 ? (
        <section className="rounded-[1.75rem] border border-dashed border-ink/20 bg-white/80 p-8 shadow-soft">
          <p className="text-sm tracking-[0.18em] text-signal">EMPTY STATE</p>
          <h3 className="mt-4 text-2xl font-semibold">まだ教材が登録されていません</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
            教材作成機能は後続 issue で追加予定です。作成後はこの画面から種別、ステータス、優先度をまとめて確認できるようになります。
          </p>
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {resources.map((resource) => {
            const status = resourceStatusMeta[resource.status];
            const priority = resourcePriorityMeta[resource.priority];

            return (
              <article
                key={resource.id}
                className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-signal">
                      {resourceTypeLabels[resource.type]}
                    </p>
                    <h3 className="mt-3 truncate text-2xl font-semibold tracking-tight">
                      {resource.title}
                    </h3>
                    <p className="mt-3 break-all text-sm leading-7 text-ink/68">
                      {resource.url}
                    </p>
                  </div>

                  <Link
                    href={`/resources/${resource.id}`}
                    className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
                  >
                    詳細を見る
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${priority.className}`}
                  >
                    優先度: {priority.label}
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-ink/8 pt-4 text-sm text-ink/62 sm:flex-row sm:items-center sm:justify-between">
                  <p>更新日: {formatUpdatedAt(resource.updatedAt)}</p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-signal underline-offset-4 hover:underline"
                  >
                    外部URLを開く
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
