import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CourseTracker",
  description: "公式ドキュメントや動画、記事を整理できる学習ダッシュボード",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
