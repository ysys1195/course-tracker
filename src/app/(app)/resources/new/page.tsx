import Link from 'next/link';
import { ResourceForm } from './resource-form';

export default function NewResourcePage() {
  return (
    <div className="grid gap-4">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] text-signal">NEW RESOURCE</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              教材を登録する
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
              公式 Docs、公式 GitHub、動画、書籍、記事などの教材を登録するフォームです。安全な入力導線と必須項目のバリデーションを先に整えます。
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

      <ResourceForm />
    </div>
  );
}
