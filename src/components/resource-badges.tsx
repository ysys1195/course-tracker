import type {
  LearningResourcePriority,
  LearningResourceStatus,
} from '@prisma/client';
import {
  resourcePriorityMeta,
  resourceStatusMeta,
} from '@/lib/resources';

type ResourceBadgesProps = {
  status: LearningResourceStatus;
  priority: LearningResourcePriority;
  showStatusPrefix?: boolean;
  showPriorityPrefix?: boolean;
};

export function ResourceBadges({
  status,
  priority,
  showStatusPrefix = false,
  showPriorityPrefix = true,
}: ResourceBadgesProps) {
  const statusMeta = resourceStatusMeta[status];
  const priorityMeta = resourcePriorityMeta[priority];

  return (
    <>
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${statusMeta.className}`}
      >
        {showStatusPrefix ? `ステータス: ${statusMeta.label}` : statusMeta.label}
      </span>
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${priorityMeta.className}`}
      >
        {showPriorityPrefix ? `優先度: ${priorityMeta.label}` : priorityMeta.label}
      </span>
    </>
  );
}
