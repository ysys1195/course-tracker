import Link from "next/link";
import { auth } from "@/auth";
import { appNavigationItems } from "@/lib/navigation";

const resourceTypes = [
  "公式 Docs",
  "公式 GitHub",
  "動画",
  "書籍",
  "記事",
  "チュートリアル",
];

const highlights = [
  "教材リンクを一元管理",
  "学習の優先度を整理",
  "次にやることを見失わない",
];

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.25),_transparent_28%),linear-gradient(135deg,_#122023_0%,_#18333a_58%,_#0f766e_100%)] p-8 text-white shadow-soft sm:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <p className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm tracking-[0.2em] text-white/80">
                LEARNING DASHBOARD
              </p>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  学習教材を、迷わず
                  <br />
                  積み上げるための
                  <br />
                  CourseTracker
                </h1>
                <p className="max-w-xl text-sm leading-7 text-white/78 sm:text-base">
                  技術学習に使う公式 Docs、公式 GitHub、動画、書籍、記事をまとめて整理する、
                  公開用ポートフォリオ向けの学習ダッシュボードです。
                </p>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link
                    href={session?.user ? "/dashboard" : "/login"}
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-white/90"
                  >
                    {session?.user ? "ダッシュボードへ" : "ログインして始める"}
                  </Link>
                  <Link
                    href={session?.user ? "/resources" : "/login"}
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    {session?.user ? "教材一覧へ" : "認証後の画面を見る"}
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-white/72">
                {session?.user ? "現在はログイン済みです" : "管理できる教材カテゴリ"}
              </p>
              {session?.user ? (
                <div className="rounded-[1rem] border border-white/15 bg-white/10 p-4 text-sm text-white/88">
                  <p className="font-medium">
                    {session.user.name || "ログイン中のユーザー"}
                  </p>
                  <p className="mt-2 text-white/72">
                    {session.user.email || "メールアドレス未設定"}
                  </p>
                </div>
              ) : null}
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {resourceTypes.map((type) => (
                  <li
                    key={type}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-center"
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article
              key={item}
              className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft"
            >
              <p className="text-sm text-signal">0{index + 1}</p>
              <h2 className="mt-4 text-xl font-semibold">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/70">
                学習リソースを見つけたあとも、記録と整理を続けやすいベース画面を用意します。
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-signal">Navigation</p>
              <h2 className="mt-3 text-2xl font-semibold">主要画面への導線</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/70">
                ダッシュボード、教材一覧、ロードマップ、設定を共通ナビゲーションから移動できる構成にしています。
              </p>
            </div>
            <Link
              href={session?.user ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center rounded-full border border-ink/12 px-5 py-3 text-sm font-medium text-ink transition hover:bg-ink/5"
            >
              {session?.user ? "ナビゲーションを開く" : "ログインして確認する"}
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {appNavigationItems.map((item) => (
              <article
                key={item.href}
                className="rounded-[1.5rem] border border-ink/10 bg-mist p-5"
              >
                <p className="text-sm text-signal">{item.shortLabel}</p>
                <h3 className="mt-3 text-lg font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm leading-7 text-ink/68">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
