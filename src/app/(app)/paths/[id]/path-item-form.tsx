'use client';

import { useActionState } from 'react';
import type { PathResourceOption } from '@/lib/path-data';
import { resourceTypeLabels, resourceStatusMeta } from '@/lib/resources';
import type { AddPathItemFormState } from '@/lib/path-item-form';

type AddPathItemFormAction = (
  state: AddPathItemFormState,
  formData: FormData
) => Promise<AddPathItemFormState>;

type PathItemFormProps = {
  action: AddPathItemFormAction;
  initialState: AddPathItemFormState;
  resources: PathResourceOption[];
};

export function PathItemForm({
  action,
  initialState,
  resources,
}: PathItemFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const inputClassName =
    'rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/32 focus:border-signal';

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm tracking-[0.18em] text-signal">ADD RESOURCE</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold leading-none text-ink">
            教材を追加
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-ink/68">
          ロードマップの末尾に教材を追加します。並び替えは後続対応として、今回は追加順をそのまま使います。
        </p>
      </div>

      <form action={formAction} className="mt-6 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">追加する教材 *</span>
          <select
            name="resourceId"
            defaultValue={state.fields.resourceId}
            className={inputClassName}
            required
          >
            <option value="">教材を選択してください</option>
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.title} / {resourceTypeLabels[resource.type]} /{' '}
                {resourceStatusMeta[resource.status].label}
              </option>
            ))}
          </select>
          {state.errors.resourceId ? (
            <span className="text-sm text-rose-700">
              {state.errors.resourceId}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">補足メモ</span>
          <textarea
            name="note"
            defaultValue={state.fields.note}
            rows={3}
            className={`${inputClassName} min-h-24 leading-7`}
            placeholder="この教材をこの順番で学ぶ理由や、見るときの観点を残せます。"
          />
          {state.errors.note ? (
            <span className="text-sm text-rose-700">{state.errors.note}</span>
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
            disabled={pending || resources.length === 0}
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? '追加中...' : '教材を追加'}
          </button>
        </div>
      </form>
    </section>
  );
}
