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
    <div className="rounded-[1.4rem] border border-ink/10 bg-mist/40 p-5">
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/46">
        <span className="font-medium text-ink">{formatUpdatedAt(log.studiedAt)}</span>
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
  const inputClassName =
    'rounded-[1.1rem] border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/32 focus:border-signal';

  return (
    <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm tracking-[0.18em] text-signal">STUDY LOGS</p>
          <h3 className="mt-2 text-[1.75rem] font-semibold leading-none text-ink">
            学習ログ
          </h3>
        </div>
        <span className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink/68">
          {studyLogs.length}件
        </span>
      </div>

      <div className="mt-6 rounded-[1.4rem] border border-ink/10 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-2 border-b border-ink/8 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <p className="text-sm font-semibold text-ink">学習ログを追加</p>
          <p className="max-w-xl text-sm leading-6 text-ink/68 sm:text-right sm:leading-7">
            学習日と学習時間、理解度メモを教材に紐づけて残せます。
          </p>
        </div>

        <form action={formAction} className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-ink">学習日 *</span>
              <input
                type="date"
                name="studiedAt"
                defaultValue={state.fields.studiedAt}
                className={inputClassName}
                required
              />
              {state.errors.studiedAt ? (
                <span className="text-sm text-rose-700">
                  {state.errors.studiedAt}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-ink">
                学習時間(分) *
              </span>
              <input
                type="number"
                name="studyMinutes"
                min="1"
                step="1"
                inputMode="numeric"
                defaultValue={state.fields.studyMinutes}
                className={inputClassName}
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

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_10.5rem] lg:items-end">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-ink">理解度メモ *</span>
              <textarea
                name="understandingNote"
                defaultValue={state.fields.understandingNote}
                rows={4}
                className={`${inputClassName} min-h-32 leading-7`}
                placeholder="どこまで理解できたか、詰まった点、次に確認したい点を書きます。"
                required
              />
              {state.errors.understandingNote ? (
                <span className="text-sm text-rose-700">
                  {state.errors.understandingNote}
                </span>
              ) : null}
            </label>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-ink">ログ種別 *</span>
                <select
                  name="type"
                  defaultValue={state.fields.type}
                  className={inputClassName}
                  required
                >
                  {studyLogTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {state.errors.type ? (
                  <span className="text-sm text-rose-700">
                    {state.errors.type}
                  </span>
                ) : null}
              </label>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d3439] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? '保存中...' : '学習ログを保存'}
              </button>
            </div>
          </div>

          {state.errors.form ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.errors.form}
            </div>
          ) : null}
        </form>
      </div>

      {studyLogs.length === 0 ? (
        <p className="mt-5 rounded-[1.15rem] bg-mist px-4 py-3 text-sm leading-7 text-ink/68">
          まだ学習ログはありません。学習日と理解度メモを入力すると、この教材に紐づく履歴として保存されます。
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {studyLogs.map((log) => (
            <StudyLogCard
              key={`${log.id}:${log.studiedAt.getTime()}`}
              log={log}
            />
          ))}
        </div>
      )}
    </article>
  );
}
