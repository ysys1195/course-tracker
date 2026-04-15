import { z } from 'zod';
import { studyLogTypeValues } from '@/lib/resources';

export const studyLogFormSchema = z.object({
  studiedAt: z.string().min(1, '学習日を入力してください。'),
  type: z.enum(studyLogTypeValues, {
    error: 'ログ種別を選択してください。',
  }),
  studyMinutes: z
    .string()
    .min(1, '学習時間を入力してください。')
    .refine((value) => /^\d+$/.test(value), {
      message: '学習時間は分単位の整数で入力してください。',
    })
    .refine((value) => Number(value) > 0, {
      message: '学習時間は1分以上で入力してください。',
    }),
  understandingNote: z
    .string()
    .trim()
    .min(1, '理解度メモを入力してください。')
    .max(5000, '理解度メモは5000文字以内で入力してください。'),
});

export type StudyLogFormInput = z.infer<typeof studyLogFormSchema>;

export type StudyLogFormFields = {
  studiedAt: string;
  type: StudyLogFormInput['type'];
  studyMinutes: string;
  understandingNote: string;
};

export type StudyLogFormErrors = Partial<
  Record<keyof StudyLogFormFields, string>
> & {
  form?: string;
};

export type StudyLogFormState = {
  fields: StudyLogFormFields;
  errors: StudyLogFormErrors;
};

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function createStudyLogFormState(
  fields?: Partial<StudyLogFormFields>
): StudyLogFormState {
  return {
    fields: {
      studiedAt: getTodayInputValue(),
      type: 'PROGRESS',
      studyMinutes: '',
      understandingNote: '',
      ...fields,
    },
    errors: {},
  };
}

export const initialStudyLogFormState = createStudyLogFormState();

export function getStudyLogFormFields(formData: FormData): StudyLogFormFields {
  return {
    studiedAt: String(formData.get('studiedAt') ?? ''),
    type: String(
      formData.get('type') ?? 'PROGRESS'
    ) as StudyLogFormFields['type'],
    studyMinutes: String(formData.get('studyMinutes') ?? ''),
    understandingNote: String(formData.get('understandingNote') ?? ''),
  };
}

export function getStudyLogFieldErrors(
  error: z.ZodError<StudyLogFormInput>
): StudyLogFormErrors {
  const flattened = error.flatten().fieldErrors;

  return {
    studiedAt: flattened.studiedAt?.[0],
    type: flattened.type?.[0],
    studyMinutes: flattened.studyMinutes?.[0],
    understandingNote: flattened.understandingNote?.[0],
  };
}
