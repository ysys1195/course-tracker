'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  getAddPathItemFieldErrors,
  getAddPathItemFormFields,
  initialAddPathItemFormState,
  addPathItemFormSchema,
  type AddPathItemFormState,
} from '@/lib/path-item-form';
import {
  getLearningPathFieldErrors,
  getLearningPathFormFields,
  learningPathFormSchema,
  type LearningPathFormState,
} from '@/lib/path-form';

function getPathDetailPath(pathId: string) {
  return `/paths/${pathId}`;
}

function getLoginRedirectPath(pathId: string) {
  return `/login?callbackUrl=${encodeURIComponent(getPathDetailPath(pathId))}`;
}

type MoveDirection = 'up' | 'down';

function revalidateLearningPathPaths(pathId: string) {
  revalidatePath('/paths');
  revalidatePath(getPathDetailPath(pathId));
  revalidatePath(`/paths/${pathId}/edit`);
}

export async function updateLearningPath(
  pathId: string,
  _prevState: LearningPathFormState,
  formData: FormData
): Promise<LearningPathFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      fields: getLearningPathFormFields(formData),
      errors: {
        form: 'ログイン状態を確認できませんでした。再度ログインしてください。',
      },
    };
  }

  const fields = getLearningPathFormFields(formData);
  const parsed = learningPathFormSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      fields,
      errors: getLearningPathFieldErrors(parsed.error),
    };
  }

  const updated = await prisma.learningPath.updateMany({
    where: {
      id: pathId,
      userId: session.user.id,
    },
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
    },
  });

  if (updated.count === 0) {
    return {
      fields,
      errors: {
        form: '操作対象のロードマップを確認できませんでした。',
      },
    };
  }

  revalidateLearningPathPaths(pathId);
  redirect(getPathDetailPath(pathId));
}

export async function addResourceToLearningPath(
  pathId: string,
  _prevState: AddPathItemFormState,
  formData: FormData
): Promise<AddPathItemFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ...initialAddPathItemFormState,
      errors: {
        form: 'ログイン状態を確認できませんでした。再度ログインしてください。',
      },
    };
  }

  const userId = session.user.id;
  const fields = getAddPathItemFormFields(formData);
  const parsed = addPathItemFormSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      fields,
      errors: getAddPathItemFieldErrors(parsed.error),
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const learningPath = await tx.learningPath.findFirst({
        where: {
          id: pathId,
          userId,
        },
        select: {
          id: true,
          items: {
            select: {
              position: true,
            },
            orderBy: {
              position: 'desc',
            },
            take: 1,
          },
        },
      });

      if (!learningPath) {
        return { ok: false as const, reason: 'path' };
      }

      const resource = await tx.learningResource.findFirst({
        where: {
          id: parsed.data.resourceId,
          userId,
        },
        select: {
          id: true,
        },
      });

      if (!resource) {
        return { ok: false as const, reason: 'resource' };
      }

      await tx.learningPathItem.create({
        data: {
          learningPathId: pathId,
          resourceId: resource.id,
          position: (learningPath.items[0]?.position ?? 0) + 1,
          note: parsed.data.note || null,
        },
      });

      return { ok: true as const, resourceId: resource.id };
    });

    if (!result.ok) {
      return {
        fields,
        errors: {
          form:
            result.reason === 'path'
              ? '操作対象のロードマップを確認できませんでした。'
              : '追加する教材を確認できませんでした。',
        },
      };
    }

    revalidateLearningPathPaths(pathId);
    revalidatePath(`/resources/${result.resourceId}`);

    return initialAddPathItemFormState;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        fields,
        errors: {
          resourceId: 'この教材はすでにロードマップに追加されています。',
        },
      };
    }

    return {
      fields,
      errors: {
        form: '教材の追加に失敗しました。時間をおいて再度お試しください。',
      },
    };
  }
}

export async function moveLearningPathItem(
  pathId: string,
  itemId: string,
  direction: MoveDirection
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(getLoginRedirectPath(pathId));
  }

  const userId = session.user.id;

  const result = await prisma.$transaction(async (tx) => {
    const currentItem = await tx.learningPathItem.findFirst({
      where: {
        id: itemId,
        learningPathId: pathId,
        learningPath: {
          userId,
        },
      },
      select: {
        id: true,
        position: true,
        resourceId: true,
      },
    });

    if (!currentItem) {
      return null;
    }

    const adjacentPosition =
      direction === 'up' ? currentItem.position - 1 : currentItem.position + 1;

    if (adjacentPosition < 1) {
      return {
        resourceIds: [currentItem.resourceId],
      };
    }

    const adjacentItem = await tx.learningPathItem.findFirst({
      where: {
        learningPathId: pathId,
        position: adjacentPosition,
      },
      select: {
        id: true,
        position: true,
        resourceId: true,
      },
    });

    if (!adjacentItem) {
      return {
        resourceIds: [currentItem.resourceId],
      };
    }

    const tempPosition = -currentItem.position;

    await tx.learningPathItem.update({
      where: {
        id: currentItem.id,
      },
      data: {
        position: tempPosition,
      },
    });

    await tx.learningPathItem.update({
      where: {
        id: adjacentItem.id,
      },
      data: {
        position: currentItem.position,
      },
    });

    await tx.learningPathItem.update({
      where: {
        id: currentItem.id,
      },
      data: {
        position: adjacentItem.position,
      },
    });

    return {
      resourceIds: [currentItem.resourceId, adjacentItem.resourceId],
    };
  });

  revalidateLearningPathPaths(pathId);

  for (const resourceId of result?.resourceIds ?? []) {
    revalidatePath(`/resources/${resourceId}`);
  }
}

export async function removeLearningPathItem(pathId: string, itemId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(getLoginRedirectPath(pathId));
  }

  const userId = session.user.id;
  const positionShiftOffset = 1_000_000;

  const result = await prisma.$transaction(async (tx) => {
    const currentItem = await tx.learningPathItem.findFirst({
      where: {
        id: itemId,
        learningPathId: pathId,
        learningPath: {
          userId,
        },
      },
      select: {
        id: true,
        position: true,
        resourceId: true,
      },
    });

    if (!currentItem) {
      return null;
    }

    await tx.learningPathItem.delete({
      where: {
        id: currentItem.id,
      },
    });

    await tx.learningPathItem.updateMany({
      where: {
        learningPathId: pathId,
        position: {
          gt: currentItem.position,
        },
      },
      data: {
        position: {
          increment: positionShiftOffset,
        },
      },
    });

    await tx.learningPathItem.updateMany({
      where: {
        learningPathId: pathId,
        position: {
          gt: currentItem.position,
        },
      },
      data: {
        position: {
          decrement: positionShiftOffset + 1,
        },
      },
    });

    return {
      resourceId: currentItem.resourceId,
    };
  });

  revalidateLearningPathPaths(pathId);

  if (result?.resourceId) {
    revalidatePath(`/resources/${result.resourceId}`);
  }
}

export async function deleteLearningPath(pathId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(getLoginRedirectPath(pathId));
  }

  const userId = session.user.id;

  const deleted = await prisma.$transaction(async (tx) => {
    const learningPath = await tx.learningPath.findFirst({
      where: {
        id: pathId,
        userId,
      },
      select: {
        id: true,
        items: {
          select: {
            resourceId: true,
          },
        },
      },
    });

    if (!learningPath) {
      return null;
    }

    await tx.learningPath.delete({
      where: {
        id: learningPath.id,
      },
    });

    return learningPath.items.map((item) => item.resourceId);
  });

  if (!deleted) {
    return;
  }

  revalidatePath('/paths');

  for (const resourceId of deleted) {
    revalidatePath(`/resources/${resourceId}`);
  }

  redirect('/paths');
}
