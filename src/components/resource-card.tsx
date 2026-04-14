import Link from 'next/link';
import type { ResourceListItem } from '@/lib/resource-data';
import { ResourceBadges } from '@/components/resource-badges';
import { ResourceStatusForm } from '@/components/resource-status-form';
import { formatUpdatedAt, resourceTypeLabels } from '@/lib/resources';

type ResourceCardProps = {
  resource: ResourceListItem;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-signal">
            {resourceTypeLabels[resource.type]}
          </p>
          <h3 className="mt-3 truncate text-2xl font-semibold tracking-tight">
            {resource.title}
          </h3>
          <p className="mt-3 break-all text-sm leading-7 text-ink/68">
            {resource.url}
          </p>
        </div>

        <Link
          href={`/resources/${resource.id}`}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
        >
          詳細を見る
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <ResourceBadges status={resource.status} priority={resource.priority} />
      </div>

      <div className="mt-5">
        <ResourceStatusForm
          resourceId={resource.id}
          status={resource.status}
          compact
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-ink/8 pt-4 text-sm text-ink/62 sm:flex-row sm:items-center sm:justify-between">
        <p>更新日: {formatUpdatedAt(resource.updatedAt)}</p>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="text-signal underline-offset-4 hover:underline"
        >
          外部URLを開く
        </a>
      </div>
    </article>
  );
}
