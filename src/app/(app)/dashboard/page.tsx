import { auth } from "@/auth";

const overviewCards = [
  {
    title: "教材整理",
    description: "公式 Docs や記事を一覧で見直しながら、次に学ぶ教材を整理します。",
  },
  {
    title: "ロードマップ把握",
    description: "今どこまで進んでいるかを俯瞰し、学習の迷子を防ぎます。",
  },
  {
    title: "設定の確認",
    description: "認証状態や今後の表示設定を見直すための入口をまとめます。",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="grid gap-4">
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,_#122023_0%,_#18333a_58%,_#0f766e_100%)] p-8 text-white shadow-soft sm:p-10">
        <p className="text-sm tracking-[0.2em] text-white/70">DASHBOARD</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {session?.user?.name || "ユーザー"}の学習ワークスペース
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
          認証済みユーザー向けの共通レイアウト上に、主要画面への導線を集約しました。次の教材管理機能を追加するための土台です。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((card, index) => (
          <article
            key={card.title}
            className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft"
          >
            <p className="text-sm text-signal">0{index + 1}</p>
            <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-ink/70">{card.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
