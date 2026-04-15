import { z } from 'zod';

export const addPathItemFormSchema = z.object({
  resourceId: z.string().trim().min(1, '追加する教材を選択してください。'),
  note: z
    .string()
    .trim()
    .max(500, '補足メモは500文字以内で入力してください。')
    .optional()
    .transform((value) => value || ''),
});

export type AddPathItemFormInput = z.infer<typeof addPathItemFormSchema>;

export type AddPathItemFormFields = {
  resourceId: string;
  note: string;
};

export type AddPathItemFormState = {
  fields: AddPathItemFormFields;
  errors: Partial<Record<keyof AddPathItemFormFields | 'form', string>>;
};

export const initialAddPathItemFormState: AddPathItemFormState = {
  fields: {
    resourceId: '',
    note: '',
  },
  errors: {},
};

export function createAddPathItemFormState(
  fields: Partial<AddPathItemFormFields> = {}
): AddPathItemFormState {
  return {
    fields: {
      ...initialAddPathItemFormState.fields,
      ...fields,
    },
    errors: {},
  };
}

export function getAddPathItemFormFields(
  formData: FormData
): AddPathItemFormFields {
  return {
    resourceId: getString(formData, 'resourceId'),
    note: getString(formData, 'note'),
  };
}

export function getAddPathItemFieldErrors(
  error: z.ZodError<AddPathItemFormInput>
) {
  const flattened = error.flatten().fieldErrors;

  return {
    resourceId: flattened.resourceId?.[0],
    note: flattened.note?.[0],
  };
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}
