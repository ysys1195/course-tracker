'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  createStudyLogFormState,
  getStudyLogFieldErrors,
  getStudyLogFormFields,
  initialStudyLogFormState,
  studyLogFormSchema,
  type StudyLogFormState,
} from '@/lib/study-log-form';

function getResourceDetailPath(resourceId: string) {
  return `/resources/${resourceId}`;
}

export async function createStudyLog(
  resourceId: string,
  _prevState: StudyLogFormState,
  formData: FormData
): Promise<StudyLogFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ...initialStudyLogFormState,
      errors: {
        form: 'ログイン状態を確認できませんでした。再度ログインしてください。',
      },
    };
  }

  const userId = session.user.id;
  const fields = getStudyLogFormFields(formData);
  const parsed = studyLogFormSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      fields,
      errors: getStudyLogFieldErrors(parsed.error),
    };
  }

  const resource = await prisma.learningResource.findFirst({
    where: {
      id: resourceId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!resource) {
    return {
      fields,
      errors: {
        form: '操作対象の教材を確認できませんでした。',
      },
    };
  }

  const data = {
    userId,
    resourceId,
    type: parsed.data.type,
    studiedAt: new Date(`${parsed.data.studiedAt}T00:00:00.000Z`),
    studyMinutes: Number(parsed.data.studyMinutes),
    understandingNote: parsed.data.understandingNote,
  } satisfies Prisma.StudyLogUncheckedCreateInput;

  try {
    await prisma.studyLog.create({
      data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        fields,
        errors: {
          form: '学習ログの保存に失敗しました。時間をおいて再度お試しください。',
        },
      };
    }

    return {
      fields,
      errors: {
        form: '学習ログの保存に失敗しました。時間をおいて再度お試しください。',
      },
    };
  }

  revalidatePath(getResourceDetailPath(resourceId));

  return createStudyLogFormState();
}
