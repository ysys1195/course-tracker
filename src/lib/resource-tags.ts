import type { Prisma } from '@prisma/client';

type ResourceTagWithName = {
  tag: {
    name: string;
  };
};

export function normalizeTagNames(input: string): string[] {
  const unique = new Set<string>();

  for (const tagName of input.split(',')) {
    const normalized = tagName.trim();

    if (!normalized) {
      continue;
    }

    unique.add(normalized);
  }

  return [...unique];
}

export function stringifyTagNames(tagNames: string[]): string {
  return tagNames.join(', ');
}

export function getTagNamesFromResourceTags(
  resourceTags: ResourceTagWithName[]
): string[] {
  return [...resourceTags]
    .map((resourceTag) => resourceTag.tag.name)
    .sort((left, right) => left.localeCompare(right, 'ja'));
}

export async function replaceResourceTags(
  tx: Prisma.TransactionClient,
  userId: string,
  resourceId: string,
  tagNames: string[]
) {
  const normalizedTagNames = [...tagNames].sort((left, right) =>
    left.localeCompare(right, 'ja')
  );

  await tx.resourceTag.deleteMany({
    where: {
      resourceId,
    },
  });

  if (normalizedTagNames.length === 0) {
    return;
  }

  await tx.tag.createMany({
    data: normalizedTagNames.map((name) => ({
      userId,
      name,
    })),
    skipDuplicates: true,
  });

  const tags = await tx.tag.findMany({
    where: {
      userId,
      name: {
        in: normalizedTagNames,
      },
    },
    select: {
      id: true,
    },
  });

  await tx.resourceTag.createMany({
    data: tags.map((tag) => ({
      resourceId,
      tagId: tag.id,
    })),
    skipDuplicates: true,
  });
}
