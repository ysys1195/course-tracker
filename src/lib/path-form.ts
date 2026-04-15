import { LearningPathStatus } from '@prisma/client';
import { z } from 'zod';

function isEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string
): value is T[keyof T] {
  return Object.values(enumObject).includes(value);
}

export const learningPathFormSchema = z.object({
  title: z.string().trim().min(1, 'ロードマップ名を入力してください。'),
  description: z
    .string()
    .trim()
    .max(1000, '説明は1000文字以内で入力してください。')
    .optional()
    .transform((value) => value || ''),
  status: z
    .string()
    .refine(
      (value): value is LearningPathStatus =>
        isEnumValue(LearningPathStatus, value),
      'ステータスを選択してください。'
    ),
});

export type LearningPathFormInput = z.infer<typeof learningPathFormSchema>;

export type LearningPathFormFields = {
  title: string;
  description: string;
  status: string;
};

export type LearningPathFormState = {
  fields: LearningPathFormFields;
  errors: Partial<Record<keyof LearningPathFormFields | 'form', string>>;
};

export const initialLearningPathFormState: LearningPathFormState = {
  fields: {
    title: '',
    description: '',
    status: 'PLANNED',
  },
  errors: {},
};

export function createLearningPathFormState(
  fields: Partial<LearningPathFormFields> = {}
): LearningPathFormState {
  return {
    fields: {
      ...initialLearningPathFormState.fields,
      ...fields,
    },
    errors: {},
  };
}

export function getLearningPathFormFields(
  formData: FormData
): LearningPathFormFields {
  return {
    title: getString(formData, 'title'),
    description: getString(formData, 'description'),
    status: getString(formData, 'status'),
  };
}

export function getLearningPathFieldErrors(
  error: z.ZodError<LearningPathFormInput>
) {
  const flattened = error.flatten().fieldErrors;

  return {
    title: flattened.title?.[0],
    description: flattened.description?.[0],
    status: flattened.status?.[0],
  };
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}
