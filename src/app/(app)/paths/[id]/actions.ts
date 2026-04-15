'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  getAddPathItemFieldErrors,
  getAddPathItemFormFields,
  initialAddPathItemFormState,
  addPathItemFormSchema,
  type AddPathItemFormState,
} from '@/lib/path-item-form';

function getPathDetailPath(pathId: string) {
  return `/paths/${pathId}`;
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
          _count: {
            select: {
              items: true,
            },
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
          position: learningPath._count.items + 1,
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

    revalidatePath('/paths');
    revalidatePath(getPathDetailPath(pathId));
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
