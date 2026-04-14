import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  formatUpdatedAt,
  resourcePriorityMeta,
  resourceStatusMeta,
  resourceTypeLabels,
} from "@/lib/resources";

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

  const resource = await prisma.learningResource.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      url: true,
      type: true,
      status: true,
      priority: true,
      updatedAt: true,
    },
  });

  if (!resource) {
    notFound();
  }

  const status = resourceStatusMeta[resource.status];
  const priority = resourcePriorityMeta[resource.priority];

  return (
    <div className="grid gap-4">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] text-signal">RESOURCE DETAIL</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              {resource.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
              教材の基本情報を確認するための最小詳細画面です。メモや学習ログの詳細領域は後続 issue で追加します。
            </p>
          </div>

          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            一覧へ戻る
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm text-signal">基本情報</p>
          <dl className="mt-5 grid gap-5 text-sm text-ink/74">
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
          </dl>
        </article>

        <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-sm text-signal">学習状態</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${status.className}`}
            >
              ステータス: {status.label}
            </span>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${priority.className}`}
            >
              優先度: {priority.label}
            </span>
          </div>
          <div className="mt-6 rounded-[1.25rem] bg-mist p-4 text-sm leading-7 text-ink/68">
            メモ一覧、学習ログ、関連ロードマップは後続 issue でこの画面に追加します。
          </div>
        </article>
      </section>
    </div>
  );
}
