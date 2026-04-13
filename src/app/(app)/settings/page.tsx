const settingsSections = [
  "アカウント表示",
  "ナビゲーション確認",
  "今後の表示設定",
];

export default function SettingsPage() {
  return (
    <div className="grid gap-4">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10">
        <p className="text-sm tracking-[0.2em] text-signal">SETTINGS</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">設定</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
          アカウント情報や表示まわりの設定を置くための画面です。認証済みレイアウトから安定して辿れることをまず担保します。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {settingsSections.map((section) => (
          <article
            key={section}
            className="rounded-[1.75rem] border border-dashed border-ink/20 bg-white/70 p-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold">{section}</h3>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              この領域は後続 issue で具体化します。現段階では共通レイアウトの配下で主要導線を確認できれば十分です。
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
