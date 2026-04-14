import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { PageHeader } from '@/components/page-header';
import { ResourceForm } from '@/components/resource-form';
import { createResourceFormState } from '@/lib/resource-form';
import {
  getAvailableTagsForUser,
  getResourceFormResourceForUser,
} from '@/lib/resource-data';
import { deleteResource, updateResource } from './actions';
import {
  getTagNamesFromResourceTags,
  stringifyTagNames,
} from '@/lib/resource-tags';

type EditResourcePageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function EditResourcePage({
  params,
}: EditResourcePageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const { id } = await params;
  const resource = await getResourceFormResourceForUser(session.user.id, id);
  const tagSuggestions = await getAvailableTagsForUser(session.user.id);

  if (!resource) {
    notFound();
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="EDIT RESOURCE"
        title={`${resource.title} を見直す`}
        description="教材の基本情報、ステータス、優先度を更新できます。削除は画面下部の確認セクションから実行します。"
        actions={
          <Link
            href={`/resources/${resource.id}`}
            className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
          >
            詳細へ戻る
          </Link>
        }
      />

      <ResourceForm
        action={updateResource.bind(null, resource.id)}
        initialState={createResourceFormState({
          title: resource.title,
          url: resource.url,
          provider: resource.provider,
          description: resource.description || '',
          tags: stringifyTagNames(
            getTagNamesFromResourceTags(resource.resourceTags)
          ),
          type: resource.type,
          status: resource.status,
          priority: resource.priority,
        })}
        submitLabel="変更を保存する"
        tagSuggestions={tagSuggestions}
        afterForm={
          <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50/70 p-5">
            <p className="text-sm tracking-[0.18em] text-rose-700">
              DANGER ZONE
            </p>
            <h3 className="mt-3 text-lg font-semibold text-ink">
              教材を削除する
            </h3>
            <p className="mt-3 text-sm leading-7 text-ink/72">
              この操作は取り消せません。削除すると教材の基本情報、紐づくメモ、学習ログ、関連ロードマップ項目もまとめて削除されます。
            </p>

            <details className="mt-5 rounded-[1.25rem] border border-rose-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-medium text-rose-700">
                削除確認を開く
              </summary>

              <form
                action={deleteResource.bind(null, resource.id)}
                className="mt-4 grid gap-4"
              >
                <label className="flex items-start gap-3 text-sm text-ink/72">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-ink/20 text-rose-700 focus:ring-rose-600"
                  />
                  <span>
                    この教材を削除し、元に戻せないことを確認しました。
                  </span>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-rose-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-800 sm:w-fit"
                >
                  教材を削除する
                </button>
              </form>
            </details>
          </section>
        }
      />
    </div>
  );
}
