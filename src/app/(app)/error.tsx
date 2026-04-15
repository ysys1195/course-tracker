'use client';

import Link from 'next/link';

type AppErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppErrorPage({ error, reset }: AppErrorPageProps) {
  return (
    <div className="grid gap-5">
      <section className="rounded-[2rem] border border-rose-200 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-sm tracking-[0.18em] text-rose-700">ERROR</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          画面の読み込みに失敗しました
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70 sm:text-base">
          データの取得中に問題が発生しました。時間をおいて再試行するか、別の画面から戻ってください。
        </p>
        {error.digest ? (
          <p className="mt-4 text-sm text-ink/52">エラーID: {error.digest}</p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439]"
          >
            再読み込みする
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-5 py-3 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </section>
    </div>
  );
}
