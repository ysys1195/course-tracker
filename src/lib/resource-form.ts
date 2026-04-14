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

export type CreateResourceFormState = {
  fields: CreateResourceInput;
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
