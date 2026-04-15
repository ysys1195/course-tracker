import { z } from 'zod';

export const noteFormSchema = z.object({
  title: z.string().trim().max(80, 'タイトルは80文字以内で入力してください。'),
  content: z
    .string()
    .trim()
    .min(1, 'メモ本文を入力してください。')
    .max(5000, 'メモ本文は5000文字以内で入力してください。'),
});

export type NoteFormInput = z.infer<typeof noteFormSchema>;

export type NoteFormFields = {
  title: string;
  content: string;
};

export type NoteFormErrors = Partial<Record<keyof NoteFormFields, string>> & {
  form?: string;
};

export type NoteFormState = {
  fields: NoteFormFields;
  errors: NoteFormErrors;
};

export const initialNoteFormState: NoteFormState = {
  fields: {
    title: '',
    content: '',
  },
  errors: {},
};

export function createNoteFormState(
  fields?: Partial<NoteFormFields>,
): NoteFormState {
  return {
    fields: {
      ...initialNoteFormState.fields,
      ...fields,
    },
    errors: {},
  };
}

export function getNoteFormFields(formData: FormData): NoteFormFields {
  return {
    title: String(formData.get('title') ?? ''),
    content: String(formData.get('content') ?? ''),
  };
}

export function getNoteFieldErrors(error: z.ZodError<NoteFormInput>) {
  const flattened = error.flatten().fieldErrors;

  return {
    title: flattened.title?.[0],
    content: flattened.content?.[0],
  } satisfies NoteFormErrors;
}
