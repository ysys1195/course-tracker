import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signInWithGitHub } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/dashboard";

  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-[2rem] bg-[linear-gradient(140deg,_#122023_0%,_#18333a_55%,_#0f766e_100%)] p-8 text-white shadow-soft sm:p-10">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm tracking-[0.18em] text-white/78">
            AUTHENTICATION
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            学習ダッシュボードを
            <br />
            自分のセッションで始める
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/78 sm:text-base">
            CourseTracker は教材や学習ログをユーザー単位で管理します。まずは GitHub
            アカウントでログインして、ダッシュボードの土台にアクセスします。
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-white/15 bg-white/10 p-5">
            <p className="text-sm text-white/72">この画面で確認できること</p>
            <ul className="mt-3 grid gap-2 text-sm text-white/88">
              <li>GitHub OAuth を使ったログイン導線</li>
              <li>ログイン済みユーザーだけが見られるダッシュボード</li>
              <li>未ログイン時の自然なリダイレクト</li>
            </ul>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
            <p className="text-sm text-signal">ログイン</p>
            <h2 className="mt-3 text-2xl font-semibold">GitHub で続行</h2>
            <p className="mt-3 text-sm leading-7 text-ink/72">
              公開ポートフォリオ段階の初期実装として、認証プロバイダーは GitHub のみに絞っています。
            </p>

            <form
              action={async () => {
                "use server";
                await signInWithGitHub(callbackUrl);
              }}
              className="mt-8"
            >
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439]"
              >
                GitHub でログイン
              </button>
            </form>

            <Link
              href="/"
              className="mt-4 inline-flex text-sm text-ink/70 transition hover:text-ink"
            >
              トップページに戻る
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
