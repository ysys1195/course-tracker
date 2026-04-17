'use server';

import { type LearningPathStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  getLearningPathFieldErrors,
  getLearningPathFormFields,
  initialLearningPathFormState,
  learningPathFormSchema,
  type LearningPathFormState,
} from '@/lib/path-form';

export async function createLearningPath(
  _prevState: LearningPathFormState,
  formData: FormData
): Promise<LearningPathFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ...initialLearningPathFormState,
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

  let learningPathId: string;

  try {
    const created = await prisma.learningPath.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        description: parsed.data.description || null,
        status: parsed.data.status as LearningPathStatus,
      },
      select: {
        id: true,
      },
    });

    learningPathId = created.id;
  } catch {
    return {
      fields,
      errors: {
        form: 'ロードマップの保存に失敗しました。時間をおいて再度お試しください。',
      },
    };
  }

  revalidatePath('/paths');
  redirect(`/paths/${learningPathId}`);
}
