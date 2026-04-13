import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNavigation } from "@/components/app-navigation";
import { signOutFromApp } from "./actions";

type AppLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-mist text-ink">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft lg:flex lg:flex-col">
          <div>
            <p className="text-sm tracking-[0.24em] text-signal">COURSETRACKER</p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              学習を横断する
              <br />
              ワークスペース
            </h1>
            <p className="mt-3 text-sm leading-7 text-ink/68">
              ダッシュボード、教材一覧、ロードマップ、設定を一つの導線で扱います。
            </p>
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-[linear-gradient(135deg,_rgba(18,32,35,0.06),_rgba(15,118,110,0.14))] p-5">
            <p className="text-sm font-medium">{session.user.name || "ログイン中のユーザー"}</p>
            <p className="mt-2 text-sm text-ink/68">
              {session.user.email || "メールアドレス未設定"}
            </p>
          </div>

          <div className="mt-6 flex-1">
            <AppNavigation />
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full border border-ink/10 px-4 py-3 text-sm text-ink/70 transition hover:border-ink/25 hover:text-ink"
            >
              トップページへ戻る
            </Link>
            <form action={signOutFromApp}>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439]"
              >
                ログアウト
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col gap-4 pb-28 lg:pb-6">
          <header className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-soft lg:hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm tracking-[0.2em] text-signal">COURSETRACKER</p>
                <h1 className="mt-2 text-xl font-semibold">主要画面をすばやく切り替える</h1>
              </div>
              <div className="rounded-[1.25rem] bg-ink/5 px-4 py-3 text-sm">
                <p className="font-medium">{session.user.name || "ログイン中のユーザー"}</p>
                <p className="mt-1 text-ink/62">{session.user.email || "メールアドレス未設定"}</p>
              </div>
            </div>
          </header>

          <main className="min-w-0">{children}</main>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-mist/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-ink/10 bg-white p-2 shadow-soft">
          <AppNavigation mobile />
        </div>
      </div>
    </div>
  );
}
