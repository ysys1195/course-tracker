import type {
  LearningResourceStatus,
  LearningPathStatus,
  ResourceType,
} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getTagNamesFromResourceTags } from '@/lib/resource-tags';
import { resourceStatusMeta } from '@/lib/resources';

export const learningPathStatusMeta: Record<
  LearningPathStatus,
  { label: string; className: string }
> = {
  PLANNED: {
    label: '計画中',
    className: 'border-slate-200 bg-slate-100 text-slate-700',
  },
  ACTIVE: {
    label: '進行中',
    className: 'border-amber-200 bg-amber-100 text-amber-800',
  },
  COMPLETED: {
    label: '完了',
    className: 'border-emerald-200 bg-emerald-100 text-emerald-800',
  },
};

const learningPathListSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  updatedAt: true,
  items: {
    orderBy: {
      position: 'asc',
    },
    select: {
      id: true,
      position: true,
      resource: {
        select: {
          id: true,
          title: true,
          status: true,
          type: true,
          priority: true,
        },
      },
    },
  },
} satisfies Prisma.LearningPathSelect;

const learningPathDetailSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  items: {
    orderBy: {
      position: 'asc',
    },
    select: {
      id: true,
      position: true,
      note: true,
      resource: {
        select: {
          id: true,
          title: true,
          url: true,
          type: true,
          status: true,
          priority: true,
          updatedAt: true,
          resourceTags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.LearningPathSelect;

export type LearningPathListItem = Prisma.LearningPathGetPayload<{
  select: typeof learningPathListSelect;
}>;

export type LearningPathDetail = Prisma.LearningPathGetPayload<{
  select: typeof learningPathDetailSelect;
}>;

export type PathResourceOption = {
  id: string;
  title: string;
  type: ResourceType;
  status: LearningResourceStatus;
};

export type LearningPathProgress = {
  totalCount: number;
  completedCount: number;
  inProgressCount: number;
  remainingCount: number;
  completionRate: number;
};

export async function getLearningPathsForUser(userId: string) {
  return prisma.learningPath.findMany({
    where: {
      userId,
    },
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    select: learningPathListSelect,
  });
}

export async function getLearningPathDetailForUser(userId: string, id: string) {
  return prisma.learningPath.findFirst({
    where: {
      id,
      userId,
    },
    select: learningPathDetailSelect,
  });
}

export async function getAvailableResourcesForLearningPath(
  userId: string,
  learningPathId: string
): Promise<PathResourceOption[]> {
  const path = await prisma.learningPath.findFirst({
    where: {
      id: learningPathId,
      userId,
    },
    select: {
      items: {
        select: {
          resourceId: true,
        },
      },
    },
  });

  if (!path) {
    return [];
  }

  const existingResourceIds = path.items.map((item) => item.resourceId);

  return prisma.learningResource.findMany({
    where: {
      userId,
      id: {
        notIn: existingResourceIds,
      },
    },
    orderBy: [{ updatedAt: 'desc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
    },
  });
}

export function getLearningPathProgress(
  items: Array<{
    resource: {
      status: LearningResourceStatus;
    };
  }>
): LearningPathProgress {
  const totalCount = items.length;
  const completedCount = items.filter(
    (item) => item.resource.status === 'COMPLETED'
  ).length;
  const inProgressCount = items.filter(
    (item) =>
      item.resource.status === 'IN_PROGRESS' ||
      item.resource.status === 'REVIEWING'
  ).length;
  const remainingCount = totalCount - completedCount;

  return {
    totalCount,
    completedCount,
    inProgressCount,
    remainingCount,
    completionRate:
      totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
  };
}

export function getLearningPathStatusBreakdown(
  items: Array<{
    resource: {
      status: LearningResourceStatus;
    };
  }>
) {
  const counts = new Map<LearningResourceStatus, number>();

  for (const item of items) {
    counts.set(
      item.resource.status,
      (counts.get(item.resource.status) ?? 0) + 1
    );
  }

  return [...counts.entries()].map(([status, count]) => ({
    status,
    label: resourceStatusMeta[status].label,
    count,
    className: resourceStatusMeta[status].className,
  }));
}

export function getPathTagNames(
  resourceTags: LearningPathDetail['items'][number]['resource']['resourceTags']
) {
  return getTagNamesFromResourceTags(resourceTags);
}
