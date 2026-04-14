import {
  LearningResourcePriority,
  LearningResourceStatus,
  ResourceType,
} from '@prisma/client';
import { z } from 'zod';

function isEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string,
): value is T[keyof T] {
  return Object.values(enumObject).includes(value);
}

export const createResourceSchema = z.object({
  title: z.string().trim().min(1, 'タイトルを入力してください。'),
  url: z.string().trim().url('有効なURLを入力してください。'),
  provider: z.string().trim().min(1, '提供元を入力してください。'),
  description: z
    .string()
    .trim()
    .max(1000, '説明は1000文字以内で入力してください。')
    .optional()
    .transform((value) => (value ? value : '')),
  type: z.string().refine(
    (value): value is ResourceType => isEnumValue(ResourceType, value),
    '教材種別を選択してください。',
  ),
  status: z.string().refine(
    (value): value is LearningResourceStatus =>
      isEnumValue(LearningResourceStatus, value),
    'ステータスを選択してください。',
  ),
  priority: z.string().refine(
    (value): value is LearningResourcePriority =>
      isEnumValue(LearningResourcePriority, value),
    '優先度を選択してください。',
  ),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;

export type CreateResourceFormFields = {
  title: string;
  url: string;
  provider: string;
  description: string;
  type: string;
  status: string;
  priority: string;
};

export type CreateResourceFormState = {
  fields: CreateResourceFormFields;
  errors: Partial<Record<keyof CreateResourceInput | 'form', string>>;
};

export const initialCreateResourceFormState: CreateResourceFormState = {
  fields: {
    title: '',
    url: '',
    provider: '',
    description: '',
    type: 'DOCS',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
  },
  errors: {},
};

export function getCreateResourceFormFields(formData: FormData): CreateResourceFormFields {
  return {
    title: getString(formData, 'title'),
    url: getString(formData, 'url'),
    provider: getString(formData, 'provider'),
    description: getString(formData, 'description'),
    type: getString(formData, 'type'),
    status: getString(formData, 'status'),
    priority: getString(formData, 'priority'),
  };
}

export function getCreateResourceFieldErrors(error: z.ZodError<CreateResourceInput>) {
  const flattened = error.flatten().fieldErrors;

  return {
    title: flattened.title?.[0],
    url: flattened.url?.[0],
    provider: flattened.provider?.[0],
    description: flattened.description?.[0],
    type: flattened.type?.[0],
    status: flattened.status?.[0],
    priority: flattened.priority?.[0],
  };
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}
