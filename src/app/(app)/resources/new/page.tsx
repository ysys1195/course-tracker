import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { ResourceForm } from './resource-form';

export default function NewResourcePage() {
  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="NEW RESOURCE"
        title="教材を登録する"
        description="公式 Docs、公式 GitHub、動画、書籍、記事などの教材を登録するフォームです。安全な入力導線と必須項目のバリデーションを先に整えます。"
        actions={
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            一覧へ戻る
          </Link>
        }
      />

      <ResourceForm />
    </div>
  );
}
