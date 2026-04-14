import { PageHeader } from '@/components/page-header';

const settingsSections = [
  "アカウント表示",
  "ナビゲーション確認",
  "今後の表示設定",
];

export default function SettingsPage() {
  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="SETTINGS"
        title="設定"
        description="アカウント情報や表示まわりの設定を置くための画面です。認証済みレイアウトから安定して辿れることをまず担保します。"
      />

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
