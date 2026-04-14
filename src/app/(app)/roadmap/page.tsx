import { PageHeader } from '@/components/page-header';

const roadmapSteps = [
  "教材収集のルールを整える",
  "学習順をロードマップ化する",
  "ログとメモを継続しやすくする",
];

export default function RoadmapPage() {
  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="ROADMAP"
        title="学習ロードマップ"
        description="学習の段取りを見失わないための画面です。今は大まかな進め方だけを置き、共通導線の確認を優先しています。"
      />

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
