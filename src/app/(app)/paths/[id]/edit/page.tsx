import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { getLearningPathDetailForUser } from '@/lib/path-data';
import { createLearningPathFormState } from '@/lib/path-form';
import { updateLearningPath } from '../actions';
import { LearningPathForm } from '../../path-form';

type EditPathPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function EditPathPage({ params }: EditPathPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;
  const learningPath = await getLearningPathDetailForUser(session.user.id, id);

  if (!learningPath) {
    notFound();
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="EDIT PATH"
        title={`${learningPath.title} を見直す`}
        description="ロードマップ名、説明、ステータスを更新できます。削除は詳細画面の確認セクションから実行できます。"
        actions={
          <Link
            href={`/paths/${learningPath.id}`}
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            詳細へ戻る
          </Link>
        }
      />

      <LearningPathForm
        action={updateLearningPath.bind(null, learningPath.id)}
        initialState={createLearningPathFormState({
          title: learningPath.title,
          description: learningPath.description || '',
          status: learningPath.status,
        })}
        eyebrow="EDIT PATH"
        title="ロードマップを編集"
        description="学習テーマや進行状況にあわせて、ロードマップの基本情報を更新します。"
        submitLabel="変更を保存する"
        pendingLabel="保存中..."
      />
    </div>
  );
}
