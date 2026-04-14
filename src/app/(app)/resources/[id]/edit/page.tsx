import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { getResourceDetailForUser } from '@/lib/resource-data';

type EditResourcePageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function EditResourcePage({
  params,
}: EditResourcePageProps) {
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
        eyebrow="EDIT RESOURCE"
        title={`${resource.title} を見直す`}
        description="教材編集機能は後続 issue で追加します。この画面は詳細画面から編集導線が切れないようにするためのプレースホルダーです。"
        actions={
          <Link
            href={`/resources/${resource.id}`}
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            詳細へ戻る
          </Link>
        }
      />

      <section className="rounded-[1.75rem] border border-dashed border-ink/20 bg-white/80 p-8 shadow-soft">
        <p className="text-sm tracking-[0.18em] text-signal">COMING SOON</p>
        <h3 className="mt-4 text-2xl font-semibold">編集フォームは次の issue で実装します</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
          この教材の基本情報、ステータス、優先度を編集できる画面を後続で追加します。今は詳細確認と編集導線の成立を優先しています。
        </p>
      </section>
    </div>
  );
}
