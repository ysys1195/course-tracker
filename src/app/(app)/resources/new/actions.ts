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
  createResourceSchema,
  initialCreateResourceFormState,
  type CreateResourceFormState,
} from '@/lib/resource-form';

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function createResource(
  _prevState: CreateResourceFormState,
  formData: FormData,
): Promise<CreateResourceFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ...initialCreateResourceFormState,
      errors: {
        form: 'ログイン状態を確認できませんでした。再度ログインしてください。',
      },
    };
  }

  const fields = {
    title: getString(formData, 'title'),
    url: getString(formData, 'url'),
    provider: getString(formData, 'provider'),
    description: getString(formData, 'description'),
    type: getString(formData, 'type'),
    status: getString(formData, 'status'),
    priority: getString(formData, 'priority'),
  };

  const parsed = createResourceSchema.safeParse(fields);

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;

    return {
      fields: {
        ...initialCreateResourceFormState.fields,
        ...fields,
      },
      errors: {
        title: flattened.title?.[0],
        url: flattened.url?.[0],
        provider: flattened.provider?.[0],
        description: flattened.description?.[0],
        type: flattened.type?.[0],
        status: flattened.status?.[0],
        priority: flattened.priority?.[0],
      },
    };
  }

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

    revalidatePath('/resources');
    redirect(`/resources/${resource.id}`);
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
}
