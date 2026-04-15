import Link from 'next/link';

export default function AppNotFoundPage() {
  return (
    <div className="grid gap-5">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-sm tracking-[0.18em] text-signal">NOT FOUND</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          目的のデータが見つかりません
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70 sm:text-base">
          教材やロードマップが削除されたか、URL
          が正しくない可能性があります。一覧画面に戻って存在するデータを確認してください。
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439]"
          >
            教材一覧へ
          </Link>
          <Link
            href="/paths"
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-5 py-3 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            ロードマップ一覧へ
          </Link>
        </div>
      </section>
    </div>
  );
}
