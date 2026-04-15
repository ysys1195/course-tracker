'use client';

import type { ReactNode } from 'react';
import { useActionState } from 'react';
import type { ResourceFormState } from '@/lib/resource-form';
import { normalizeTagNames } from '@/lib/resource-tags';
import {
  resourcePriorityOptions,
  resourceStatusOptions,
  resourceTypeOptions,
} from '@/lib/resources';

type ResourceFormAction = (
  state: ResourceFormState,
  formData: FormData
) => Promise<ResourceFormState>;

type ResourceFormProps = {
  action: ResourceFormAction;
  initialState: ResourceFormState;
  submitLabel: string;
  tagSuggestions?: string[];
  afterForm?: ReactNode;
};

type FieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

function Field({
  label,
  error,
  required = false,
  className,
  children,
}: FieldProps) {
  return (
    <label className={`grid gap-2 ${className ?? ''}`}>
      <span className="text-sm font-medium text-ink">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
      {error ? <span className="text-sm text-rose-700">{error}</span> : null}
    </label>
  );
}

export function ResourceForm({
  action,
  initialState,
  submitLabel,
  tagSuggestions = [],
  afterForm,
}: ResourceFormProps) {
  const [state, formAction, pending] = useActionState<
    ResourceFormState,
    FormData
  >(action, initialState);
  const currentTags = normalizeTagNames(state.fields.tags);

  return (
    <div className="grid gap-6">
      <form action={formAction} className="grid gap-6">
        <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="タイトル" required error={state.errors.title}>
              <input
                name="title"
                defaultValue={state.fields.title}
                required
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                placeholder="例: Next.js Documentation"
              />
            </Field>

            <Field label="提供元" required error={state.errors.provider}>
              <input
                name="provider"
                defaultValue={state.fields.provider}
                required
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                placeholder="例: Vercel"
              />
            </Field>

            <Field
              label="URL"
              required
              error={state.errors.url}
              className="sm:col-span-2"
            >
              <input
                name="url"
                type="url"
                defaultValue={state.fields.url}
                required
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                placeholder="https://nextjs.org/docs"
              />
            </Field>

            <Field
              label="説明"
              error={state.errors.description}
              className="sm:col-span-2"
            >
              <textarea
                name="description"
                defaultValue={state.fields.description}
                rows={5}
                maxLength={1000}
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                placeholder="教材の概要や、何を学ぶために使うかを書きます。"
              />
            </Field>

            <Field label="タグ" className="sm:col-span-2">
              <div className="grid gap-3">
                <input
                  name="tags"
                  defaultValue={state.fields.tags}
                  className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                  placeholder="例: React, Next.js, Prisma"
                />

                {currentTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full border border-signal/20 bg-signal/10 px-3 py-1 text-sm text-signal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <p className="text-sm leading-6 text-ink/62">
                  カンマ区切りで入力します。新しいタグは保存時に自動で作成されます。
                </p>

                {tagSuggestions.length > 0 ? (
                  <div className="grid gap-2">
                    <p className="text-sm font-medium text-ink/70">既存タグ</p>
                    <div className="flex flex-wrap gap-2">
                      {tagSuggestions.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm text-ink/68"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </Field>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 lg:grid-cols-3">
            <Field label="教材種別" required error={state.errors.type}>
              <select
                name="type"
                defaultValue={state.fields.type}
                required
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
              >
                {resourceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="ステータス" required error={state.errors.status}>
              <select
                name="status"
                defaultValue={state.fields.status}
                required
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
              >
                {resourceStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="優先度" required error={state.errors.priority}>
              <select
                name="priority"
                defaultValue={state.fields.priority}
                required
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
              >
                {resourcePriorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {state.errors.form ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.errors.form}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {pending ? '保存中...' : submitLabel}
            </button>
          </div>
        </section>
      </form>
      {afterForm}
    </div>
  );
}
