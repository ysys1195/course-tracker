'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  initialStatusUpdateState,
  resourceStatusOnlySchema,
  type StatusUpdateState,
} from '@/lib/resources';

function getStatusValue(formData: FormData) {
  const value = formData.get('status');
  return typeof value === 'string' ? value : '';
}

export async function updateResourceStatus(
  resourceId: string,
  _prevState: StatusUpdateState,
  formData: FormData,
): Promise<StatusUpdateState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: 'ログイン状態を確認できませんでした。',
      type: 'error',
    };
  }

  const status = getStatusValue(formData);
  const parsed = resourceStatusOnlySchema.safeParse({ status });

  if (!parsed.success) {
    return {
      message: parsed.error.flatten().fieldErrors.status?.[0] || 'ステータスを選択してください。',
      type: 'error',
    };
  }

  const result = await prisma.learningResource.updateMany({
    where: {
      id: resourceId,
      userId: session.user.id,
    },
    data: {
      status: parsed.data.status,
    },
  });

  if (result.count === 0) {
    return {
      message: '教材を更新できませんでした。',
      type: 'error',
    };
  }

  revalidatePath('/resources');
  revalidatePath(`/resources/${resourceId}`);
  revalidatePath(`/resources/${resourceId}/edit`);

  return {
    message: 'ステータスを更新しました。',
    type: 'success',
  };
}
