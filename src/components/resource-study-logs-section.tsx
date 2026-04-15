'use client';

import { useActionState } from 'react';
import { createStudyLog } from '@/app/(app)/resources/[id]/study-logs/actions';
import {
  initialStudyLogFormState,
  type StudyLogFormState,
} from '@/lib/study-log-form';
import type { ResourceDetail } from '@/lib/resource-data';
import {
  formatUpdatedAt,
  studyLogTypeLabels,
  studyLogTypeOptions,
} from '@/lib/resources';

type CreateStudyLogAction = (
  state: StudyLogFormState,
  formData: FormData,
) => Promise<StudyLogFormState>;

export type ResourceStudyLogsSectionProps = {
  resourceId: string;
  studyLogs: ResourceDetail['studyLogs'];
};

type StudyLogCardProps = {
  log: ResourceDetail['studyLogs'][number];
};

function StudyLogCard({ log }: StudyLogCardProps) {
  return (
    <div className="rounded-[1.25rem] border border-ink/10 bg-mist/40 p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-ink/46">
        <span>{formatUpdatedAt(log.studiedAt)}</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink/68">
          {studyLogTypeLabels[log.type]}
        </span>
        <span>{log.studyMinutes}分</span>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/72">
        {log.understandingNote}
      </p>
    </div>
  );
}

export function ResourceStudyLogsSection({
  resourceId,
  studyLogs,
}: ResourceStudyLogsSectionProps) {
  const [state, formAction, pending] = useActionState<
    StudyLogFormState,
    FormData
  >(
    createStudyLog.bind(null, resourceId) as CreateStudyLogAction,
    initialStudyLogFormState,
  );

  return (
    <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-signal">STUDY LOGS</p>
          <h3 className="mt-2 text-xl font-semibold">学習ログ</h3>
        </div>
        <span className="rounded-full bg-mist px-3 py-1 text-sm text-ink/68">
          {studyLogs.length}件
        </span>
      </div>

      <div className="mt-6 rounded-[1.25rem] border border-ink/10 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm font-medium text-ink">学習ログを追加</p>
          <p className="text-sm leading-7 text-ink/68">
            学習日と学習時間、理解度メモを教材に紐づけて残せます。
          </p>
        </div>

        <form action={formAction} className="mt-4 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-ink">学習日 *</span>
              <input
                type="date"
                name="studiedAt"
                defaultValue={state.fields.studiedAt}
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                required
              />
              {state.errors.studiedAt ? (
                <span className="text-sm text-rose-700">
                  {state.errors.studiedAt}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-ink">学習時間(分) *</span>
              <input
                type="number"
                name="studyMinutes"
                min="1"
                step="1"
                inputMode="numeric"
                defaultValue={state.fields.studyMinutes}
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                placeholder="例: 45"
                required
              />
              {state.errors.studyMinutes ? (
                <span className="text-sm text-rose-700">
                  {state.errors.studyMinutes}
                </span>
              ) : null}
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-ink">理解度メモ *</span>
              <textarea
                name="understandingNote"
                defaultValue={state.fields.understandingNote}
                rows={4}
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-signal"
                placeholder="どこまで理解できたか、詰まった点、次に確認したい点を書きます。"
                required
              />
              {state.errors.understandingNote ? (
                <span className="text-sm text-rose-700">
                  {state.errors.understandingNote}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-ink">ログ種別 *</span>
              <select
                name="type"
                defaultValue={state.fields.type}
                className="rounded-2xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-signal"
                required
              >
                {studyLogTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {state.errors.type ? (
                <span className="text-sm text-rose-700">{state.errors.type}</span>
              ) : null}
            </label>
          </div>

          {state.errors.form ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.errors.form}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? '保存中...' : '学習ログを保存'}
            </button>
          </div>
        </form>
      </div>

      {studyLogs.length === 0 ? (
        <p className="mt-6 rounded-[1.25rem] bg-mist p-4 text-sm leading-7 text-ink/68">
          まだ学習ログはありません。学習日と理解度メモを入力すると、この教材に紐づく履歴として保存されます。
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {studyLogs.map((log) => (
            <StudyLogCard key={`${log.id}:${log.studiedAt.getTime()}`} log={log} />
          ))}
        </div>
      )}
    </article>
  );
}
