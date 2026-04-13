const resourceColumns = [
  "未着手",
  "学習中",
  "後で見る",
];

export default function ResourcesPage() {
  return (
    <div className="grid gap-4">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-sm tracking-[0.2em] text-signal">RESOURCES</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">教材一覧</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
          これから公式 Docs、GitHub、動画、書籍、記事を一元管理する一覧画面になります。今は共通レイアウト上で導線だけ先に整えています。
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {resourceColumns.map((column) => (
          <article
            key={column}
            className="rounded-[1.75rem] border border-dashed border-ink/20 bg-white/70 p-6 shadow-soft"
          >
            <p className="text-sm text-signal">{column}</p>
            <div className="mt-5 rounded-[1.25rem] bg-mist p-5 text-sm leading-7 text-ink/68">
              ここに教材カードが入ります。空状態、優先度、タグの表現は後続 issue で追加します。
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
