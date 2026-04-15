import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { ResourceListFilters } from '@/lib/resources';

export const resourceListSelect = {
  id: true,
  title: true,
  type: true,
  status: true,
  priority: true,
  updatedAt: true,
  url: true,
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
} satisfies Prisma.LearningResourceSelect;

export const resourceDetailSelect = {
  id: true,
  title: true,
  url: true,
  provider: true,
  description: true,
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
  notes: {
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
    },
  },
  studyLogs: {
    orderBy: [{ studiedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      type: true,
      studyMinutes: true,
      understandingNote: true,
      studiedAt: true,
    },
  },
  learningPathItems: {
    orderBy: {
      position: 'asc',
    },
    select: {
      id: true,
      position: true,
      learningPath: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
  },
} satisfies Prisma.LearningResourceSelect;

export const resourceFormSelect = {
  id: true,
  title: true,
  url: true,
  provider: true,
  description: true,
  type: true,
  status: true,
  priority: true,
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
} satisfies Prisma.LearningResourceSelect;

export type ResourceListItem = Prisma.LearningResourceGetPayload<{
  select: typeof resourceListSelect;
}>;

export type ResourceDetail = Prisma.LearningResourceGetPayload<{
  select: typeof resourceDetailSelect;
}>;

export type ResourceFormResource = Prisma.LearningResourceGetPayload<{
  select: typeof resourceFormSelect;
}>;

function buildResourceOrderBy(sort: ResourceListFilters['sort']) {
  switch (sort) {
    case 'updatedAt_asc':
      return [{ updatedAt: 'asc' }] satisfies Prisma.LearningResourceOrderByWithRelationInput[];
    case 'priority_desc':
      return [
        { priority: 'desc' },
        { updatedAt: 'desc' },
      ] satisfies Prisma.LearningResourceOrderByWithRelationInput[];
    case 'priority_asc':
      return [
        { priority: 'asc' },
        { updatedAt: 'desc' },
      ] satisfies Prisma.LearningResourceOrderByWithRelationInput[];
    case 'updatedAt_desc':
    default:
      return [{ updatedAt: 'desc' }] satisfies Prisma.LearningResourceOrderByWithRelationInput[];
  }
}

export async function getResourcesForUser(
  userId: string,
  filters: ResourceListFilters,
) {
  const where: Prisma.LearningResourceWhereInput = {
    userId,
  };

  if (filters.q) {
    where.title = {
      contains: filters.q,
      mode: 'insensitive',
    };
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  return prisma.learningResource.findMany({
    where,
    orderBy: buildResourceOrderBy(filters.sort),
    select: resourceListSelect,
  });
}

export async function getResourceDetailForUser(userId: string, id: string) {
  return prisma.learningResource.findFirst({
    where: {
      id,
      userId,
    },
    select: resourceDetailSelect,
  });
}

export async function getResourceFormResourceForUser(
  userId: string,
  id: string
) {
  return prisma.learningResource.findFirst({
    where: {
      id,
      userId,
    },
    select: resourceFormSelect,
  });
}

export async function getAvailableTagsForUser(userId: string) {
  const tags = await prisma.tag.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      name: true,
    },
  });

  return tags.map((tag) => tag.name);
}
