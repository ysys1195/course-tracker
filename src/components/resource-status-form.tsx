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

  return (
    <form action={formAction} className="grid gap-3">
      <div className={compact ? 'flex flex-col gap-2 sm:flex-row' : 'grid gap-3'}>
        <select
          name="status"
          defaultValue={status}
          className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
          aria-label="学習ステータス"
        >
          {resourceStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-3 text-sm font-medium text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
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
