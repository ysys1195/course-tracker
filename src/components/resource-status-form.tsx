'use client';

import { useActionState } from 'react';
import type { LearningResourceStatus } from '@prisma/client';
import { updateResourceStatus } from '@/app/(app)/resources/actions';
import {
  initialStatusUpdateState,
  resourceStatusOptions,
  type StatusUpdateState,
} from '@/lib/resources';

type ResourceStatusFormProps = {
  resourceId: string;
  status: LearningResourceStatus;
  compact?: boolean;
};

export function ResourceStatusForm({
  resourceId,
  status,
  compact = false,
}: ResourceStatusFormProps) {
  const [state, formAction, pending] = useActionState<StatusUpdateState, FormData>(
    updateResourceStatus.bind(null, resourceId),
    initialStatusUpdateState,
  );
  const fieldLayoutClassName = compact
    ? 'flex flex-col gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center'
    : 'grid gap-3';
  const selectClassName = compact
    ? 'min-w-0 rounded-full border border-ink/12 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-signal'
    : 'rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal';
  const buttonClassName = compact
    ? 'inline-flex w-full items-center justify-center rounded-full border border-ink/12 bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto'
    : 'inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-3 text-sm font-medium text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <form
      action={formAction}
      className={
        compact ? 'grid gap-3 rounded-[1.25rem] bg-mist/55 p-4' : 'grid gap-3'
      }
    >
      {compact ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-ink">学習ステータス</p>
          <p className="text-sm leading-6 text-ink/68">
            一覧からそのまま更新できます。
          </p>
        </div>
      ) : null}

      <div className={fieldLayoutClassName}>
        <select
          name="status"
          defaultValue={status}
          className={selectClassName}
          aria-label="学習ステータス"
        >
          {resourceStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={pending} className={buttonClassName}>
          {pending ? '更新中...' : compact ? '更新' : 'ステータスを更新'}
        </button>
      </div>

      {state.message ? (
        <p
          className={`text-sm ${
            state.type === 'error' ? 'text-rose-700' : 'text-emerald-700'
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
