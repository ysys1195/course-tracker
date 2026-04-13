import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signOutFromDashboard } from "./actions";

const nextSteps = [
  "教材一覧の作成",
  "タグ管理の設計",
  "学習ログの追加フロー",
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="rounded-[2rem] bg-white p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-signal">Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                ログイン済みユーザー向けの保護ページ
              </h1>
              <p className="mt-4 text-sm leading-7 text-ink/72">
                {session.user.name || "ユーザー"} としてログインしています。
                {session.user.email ? ` 現在のメールアドレスは ${session.user.email} です。` : ""}
              </p>
            </div>

            <form
              action={async () => {
                "use server";
                await signOutFromDashboard();
              }}
            >
              <button
                type="submit"
                className="inline-flex rounded-full border border-ink/15 px-4 py-2 text-sm text-ink transition hover:border-ink/30 hover:bg-ink/5"
              >
                ログアウト
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {nextSteps.map((step, index) => (
            <article
              key={step}
              className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft"
            >
              <p className="text-sm text-signal">0{index + 1}</p>
              <h2 className="mt-4 text-xl font-semibold">{step}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/70">
                このダッシュボードを起点に、認証済みユーザーの教材管理機能を段階的に追加していきます。
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
