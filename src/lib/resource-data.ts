import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

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
    orderBy: {
      studiedAt: 'desc',
    },
    select: {
      id: true,
      type: true,
      content: true,
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

export async function getResourcesForUser(userId: string) {
  return prisma.learningResource.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
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
