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
  getResourceFieldErrors,
  getResourceFormFields,
  initialResourceFormState,
  resourceFormSchema,
  type ResourceFormState,
} from '@/lib/resource-form';

export async function createResource(
  _prevState: ResourceFormState,
  formData: FormData
): Promise<ResourceFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ...initialResourceFormState,
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
        ...initialResourceFormState.fields,
        ...fields,
      },
      errors: getResourceFieldErrors(parsed.error),
    };
  }

  let resourceId: string;

  try {
    const resource = await prisma.learningResource.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        url: parsed.data.url,
        provider: parsed.data.provider,
        description: parsed.data.description || null,
        type: parsed.data.type as ResourceType,
        status: parsed.data.status as LearningResourceStatus,
        priority: parsed.data.priority as LearningResourcePriority,
      },
      select: {
        id: true,
      },
    });
    resourceId = resource.id;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        fields: parsed.data,
        errors: {
          url: 'このURLはすでに登録されています。',
        },
      };
    }

    return {
      fields: parsed.data,
      errors: {
        form: '教材の保存に失敗しました。時間をおいて再度お試しください。',
      },
    };
  }

  revalidatePath('/resources');
  redirect(`/resources/${resourceId}`);
}
