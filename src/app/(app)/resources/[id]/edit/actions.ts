'use server';

import {
  Prisma,
  type LearningResourcePriority,
  type LearningResourceStatus,
  type ResourceType,
} from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  createResourceFormState,
  getResourceFieldErrors,
  getResourceFormFields,
  resourceFormSchema,
  type ResourceFormState,
} from '@/lib/resource-form';

function getEditResourceInitialState(formData: FormData) {
  return createResourceFormState(getResourceFormFields(formData));
}

export async function updateResource(
  resourceId: string,
  _prevState: ResourceFormState,
  formData: FormData,
): Promise<ResourceFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ...getEditResourceInitialState(formData),
      errors: {
        form: 'ログイン状態を確認できませんでした。再度ログインしてください。',
      },
    };
  }

  const fields = getResourceFormFields(formData);
  const parsed = resourceFormSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      fields: {
        ...getEditResourceInitialState(formData).fields,
      },
      errors: getResourceFieldErrors(parsed.error),
    };
  }

  try {
    const result = await prisma.learningResource.updateMany({
      where: {
        id: resourceId,
        userId: session.user.id,
      },
      data: {
        title: parsed.data.title,
        url: parsed.data.url,
        provider: parsed.data.provider,
        description: parsed.data.description || null,
        type: parsed.data.type as ResourceType,
        status: parsed.data.status as LearningResourceStatus,
        priority: parsed.data.priority as LearningResourcePriority,
      },
    });

    if (result.count === 0) {
      return {
        ...getEditResourceInitialState(formData),
        errors: {
          form: '操作対象の教材を確認できませんでした。',
        },
      };
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        ...getEditResourceInitialState(formData),
        errors: {
          url: 'このURLはすでに登録されています。',
        },
      };
    }

    return {
      ...getEditResourceInitialState(formData),
      errors: {
        form: '教材の更新に失敗しました。時間をおいて再度お試しください。',
      },
    };
  }

  revalidatePath('/resources');
  revalidatePath(`/resources/${resourceId}`);
  redirect(`/resources/${resourceId}`);
}

export async function deleteResource(resourceId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/resources');
  }

  await prisma.learningResource.deleteMany({
    where: {
      id: resourceId,
      userId: session.user.id,
    },
  });

  revalidatePath('/resources');
  revalidatePath(`/resources/${resourceId}`);
  redirect('/resources');
}
