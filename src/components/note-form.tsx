'use client';

import type { ReactNode } from 'react';
import { useActionState } from 'react';
import type { NoteFormState } from '@/lib/note-form';

type NoteFormAction = (
  state: NoteFormState,
  formData: FormData,
) => Promise<NoteFormState>;

type NoteFormProps = {
  action: NoteFormAction;
  initialState: NoteFormState;
  submitLabel: string;
  pendingLabel: string;
  actions?: ReactNode;
  compact?: boolean;
  layout?: 'default' | 'dense';
};

export function NoteForm({
  action,
  initialState,
  submitLabel,
  pendingLabel,
  actions,
  compact = false,
  layout = 'default',
}: NoteFormProps) {
  const [state, formAction, pending] = useActionState<NoteFormState, FormData>(
    action,
    initialState
  );
  const fieldGapClassName = layout === 'dense' ? 'gap-3' : 'gap-4';
  const textareaRows = compact ? 5 : layout === 'dense' ? 4 : 6;

  return (
    <form action={formAction} className={`grid ${fieldGapClassName}`}>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">タイトル</span>
        <input
          name="title"
          defaultValue={state.fields.title}
          className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
          placeholder="例: App Router の気づき"
        />
        {state.errors.title ? (
          <span className="text-sm text-rose-700">{state.errors.title}</span>
        ) : null}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">本文 *</span>
        <textarea
          name="content"
          defaultValue={state.fields.content}
          rows={textareaRows}
          className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-signal"
          placeholder="教材を読んで分かったこと、あとで見返したいポイントを書きます。"
          required
        />
        {state.errors.content ? (
          <span className="text-sm text-rose-700">{state.errors.content}</span>
        ) : null}
      </label>

      {state.errors.form ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.errors.form}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {actions}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
