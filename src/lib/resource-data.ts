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
} satisfies Prisma.LearningResourceSelect;

export type ResourceListItem = Prisma.LearningResourceGetPayload<{
  select: typeof resourceListSelect;
}>;

export type ResourceDetail = Prisma.LearningResourceGetPayload<{
  select: typeof resourceDetailSelect;
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
