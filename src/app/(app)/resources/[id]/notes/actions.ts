'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  createNoteFormState,
  getNoteFieldErrors,
  getNoteFormFields,
  initialNoteFormState,
  noteFormSchema,
  type NoteFormState,
} from '@/lib/note-form';

function getResourceDetailPath(resourceId: string) {
  return `/resources/${resourceId}`;
}

function getLoginRedirectPath(resourceId: string) {
  return `/login?callbackUrl=${encodeURIComponent(getResourceDetailPath(resourceId))}`;
}

function getNoteInitialState(formData: FormData) {
  return createNoteFormState(getNoteFormFields(formData));
}

export async function createNote(
  resourceId: string,
  _prevState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ...initialNoteFormState,
      errors: {
        form: 'ログイン状態を確認できませんでした。再度ログインしてください。',
      },
    };
  }

  const userId = session.user.id;
  const fields = getNoteFormFields(formData);
  const parsed = noteFormSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      fields,
      errors: getNoteFieldErrors(parsed.error),
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

  await prisma.note.create({
    data: {
      userId,
      resourceId,
      title: parsed.data.title || null,
      content: parsed.data.content,
    },
  });

  revalidatePath(getResourceDetailPath(resourceId));

  return initialNoteFormState;
}

export async function updateNote(
  resourceId: string,
  noteId: string,
  _prevState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ...getNoteInitialState(formData),
      errors: {
        form: 'ログイン状態を確認できませんでした。再度ログインしてください。',
      },
    };
  }

  const userId = session.user.id;
  const fields = getNoteFormFields(formData);
  const parsed = noteFormSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      fields,
      errors: getNoteFieldErrors(parsed.error),
    };
  }

  const updated = await prisma.note.updateMany({
    where: {
      id: noteId,
      resourceId,
      userId,
    },
    data: {
      title: parsed.data.title || null,
      content: parsed.data.content,
    },
  });

  if (updated.count === 0) {
    return {
      ...getNoteInitialState(formData),
      errors: {
        form: '操作対象のメモを確認できませんでした。',
      },
    };
  }

  revalidatePath(getResourceDetailPath(resourceId));

  return createNoteFormState({
    title: parsed.data.title,
    content: parsed.data.content,
  });
}

export async function deleteNote(resourceId: string, noteId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(getLoginRedirectPath(resourceId));
  }

  await prisma.note.deleteMany({
    where: {
      id: noteId,
      resourceId,
      userId: session.user.id,
    },
  });

  revalidatePath(getResourceDetailPath(resourceId));
}
