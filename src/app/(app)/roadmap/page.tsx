const roadmapSteps = [
  "教材収集のルールを整える",
  "学習順をロードマップ化する",
  "ログとメモを継続しやすくする",
];

export default function RoadmapPage() {
  return (
    <div className="grid gap-4">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-sm tracking-[0.2em] text-signal">ROADMAP</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">学習ロードマップ</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
          学習の段取りを見失わないための画面です。今は大まかな進め方だけを置き、共通導線の確認を優先しています。
        </p>
      </section>

      <section className="grid gap-4">
        {roadmapSteps.map((step, index) => (
          <article
            key={step}
            className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft"
          >
            <p className="text-sm text-signal">STEP 0{index + 1}</p>
            <h3 className="mt-3 text-xl font-semibold">{step}</h3>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              詳細なチェック項目や状態遷移は後続で設計し、ここでは主要画面として移動できることを優先します。
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
