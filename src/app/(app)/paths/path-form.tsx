'use client';

import { useActionState } from 'react';
import { learningPathStatusMeta } from '@/lib/path-data';
import type { LearningPathFormState } from '@/lib/path-form';

type LearningPathFormAction = (
  state: LearningPathFormState,
  formData: FormData
) => Promise<LearningPathFormState>;

type LearningPathFormProps = {
  action: LearningPathFormAction;
  initialState: LearningPathFormState;
  submitLabel: string;
  pendingLabel: string;
};

const learningPathStatusOptions = [
  { value: 'PLANNED', label: learningPathStatusMeta.PLANNED.label },
  { value: 'ACTIVE', label: learningPathStatusMeta.ACTIVE.label },
  { value: 'COMPLETED', label: learningPathStatusMeta.COMPLETED.label },
] as const;

export function LearningPathForm({
  action,
  initialState,
  submitLabel,
  pendingLabel,
}: LearningPathFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const inputClassName =
    'rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/32 focus:border-signal';

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm tracking-[0.18em] text-signal">NEW PATH</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold leading-none text-ink">
            ロードマップを作成
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-ink/68">
          学習テーマごとに教材をまとめる箱を作ります。作成後に教材を追加して順番を整えられます。
        </p>
      </div>

      <form action={formAction} className="mt-6 grid gap-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-ink">
              ロードマップ名 *
            </span>
            <input
              name="title"
              defaultValue={state.fields.title}
              required
              className={inputClassName}
              placeholder="例: Next.js Full-Stack Roadmap"
            />
            {state.errors.title ? (
              <span className="text-sm text-rose-700">
                {state.errors.title}
              </span>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-ink">ステータス *</span>
            <select
              name="status"
              defaultValue={state.fields.status}
              className={inputClassName}
              required
            >
              {learningPathStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {state.errors.status ? (
              <span className="text-sm text-rose-700">
                {state.errors.status}
              </span>
            ) : null}
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">説明</span>
          <textarea
            name="description"
            defaultValue={state.fields.description}
            rows={4}
            className={`${inputClassName} min-h-28 leading-7`}
            placeholder="何を学ぶロードマップか、最終的に目指す状態や順番の意図を書きます。"
          />
          {state.errors.description ? (
            <span className="text-sm text-rose-700">
              {state.errors.description}
            </span>
          ) : null}
        </label>

        {state.errors.form ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.errors.form}
          </div>
        ) : null}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {pending ? pendingLabel : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
