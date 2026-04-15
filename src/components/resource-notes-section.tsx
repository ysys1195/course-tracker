'use client';

import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import {
  createNote,
  deleteNote,
  updateNote,
} from '@/app/(app)/resources/[id]/notes/actions';
import { createNoteFormState, initialNoteFormState } from '@/lib/note-form';
import type { ResourceDetail } from '@/lib/resource-data';
import { formatUpdatedAt } from '@/lib/resources';
import { NoteForm } from '@/components/note-form';

type ResourceNotesSectionProps = {
  resourceId: string;
  notes: ResourceDetail['notes'];
};

type ResourceNoteCardProps = {
  resourceId: string;
  note: ResourceDetail['notes'][number];
};

function DeleteNoteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? '削除中...' : '削除する'}
    </button>
  );
}

function ResourceNoteCard({ resourceId, note }: ResourceNoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();

  const editInitialState = createNoteFormState({
    title: note.title ?? '',
    content: note.content,
  });

  async function handleDeleteAction() {
    startDeleteTransition(async () => {
      await deleteNote(resourceId, note.id);
    });
  }

  if (isEditing) {
    return (
      <div className="rounded-[1.4rem] border border-ink/10 bg-mist/40 p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div>
            <p className="text-sm text-ink/46">
              更新日: {formatUpdatedAt(note.updatedAt)}
            </p>
            <h4 className="mt-2 text-lg font-semibold text-ink">
              {note.title || 'タイトル未設定のメモ'}
            </h4>
          </div>
        </div>
        <div className="mt-4">
          <NoteForm
            action={updateNote.bind(null, resourceId, note.id)}
            initialState={editInitialState}
            submitLabel="メモを更新"
            pendingLabel="更新中..."
            compact
            layout="dense"
            actions={
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center rounded-full border border-ink/12 px-5 py-3 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
              >
                キャンセル
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.4rem] border border-ink/10 bg-mist/40 p-5">
      <div className="grid gap-3">
        <div>
          <p className="text-sm text-ink/46">
            更新日: {formatUpdatedAt(note.updatedAt)}
          </p>
          <h4 className="mt-2 text-lg font-semibold text-ink">
            {note.title || 'タイトル未設定のメモ'}
          </h4>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/72">
        {note.content}
      </p>

      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-ink/10 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsDeleteConfirming(false);
            setIsEditing(true);
          }}
          className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => setIsDeleteConfirming((current) => !current)}
          className="inline-flex items-center justify-center rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
        >
          削除
        </button>
      </div>

      {isDeleteConfirming ? (
        <div className="mt-4 rounded-[1.25rem] border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm leading-6 text-rose-700">
            このメモを削除します。操作は取り消せません。
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsDeleteConfirming(false)}
              className="inline-flex items-center justify-center rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/72 transition hover:bg-white hover:text-ink"
            >
              キャンセル
            </button>
            <form action={handleDeleteAction}>
              <DeleteNoteSubmitButton />
            </form>
          </div>
        </div>
      ) : null}

      {isDeletePending ? (
        <p className="mt-3 text-sm text-ink/60">メモを削除しています...</p>
      ) : null}
    </div>
  );
}

export function ResourceNotesSection({
  resourceId,
  notes,
}: ResourceNotesSectionProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(notes.length === 0);

  return (
    <article className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm tracking-[0.18em] text-signal">NOTES</p>
          <h3 className="mt-2 text-[1.75rem] font-semibold leading-none text-ink">
            学習メモ
          </h3>
        </div>
        <span className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink/68">
          {notes.length}件
        </span>
      </div>

      {isComposerOpen ? (
        <div className="mt-6 rounded-[1.4rem] border border-ink/10 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-2 border-b border-ink/8 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <p className="text-sm font-semibold text-ink">メモを追加</p>
            <p className="max-w-xl text-sm leading-6 text-ink/68 sm:text-right sm:leading-7">
              教材を読んで気づいたことや、あとで見返したいポイントを残せます。
            </p>
          </div>

          <div className="mt-5">
            <NoteForm
              action={createNote.bind(null, resourceId)}
              initialState={initialNoteFormState}
              submitLabel="メモを保存"
              pendingLabel="保存中..."
              layout="dense"
              actions={
                notes.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="inline-flex items-center justify-center rounded-full border border-ink/12 px-5 py-3 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink"
                  >
                    キャンセル
                  </button>
                ) : undefined
              }
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-[1.4rem] border border-ink/10 bg-mist/40 p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-ink">新しいメモを追加</p>
            <p className="mt-2 text-sm leading-7 text-ink/68">
              気づきや復習ポイントを、この教材に紐づくメモとして残せます。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsComposerOpen(true)}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d3439] sm:w-auto"
          >
            メモを追加
          </button>
        </div>
      )}

      {notes.length === 0 ? (
        <p className="mt-5 rounded-[1.15rem] bg-mist px-4 py-3 text-sm leading-7 text-ink/68">
          まだメモはありません。タイトルと本文を入力すると、この教材に紐づく学習メモとして保存されます。
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {notes.map((note) => (
            <ResourceNoteCard
              key={`${note.id}:${note.updatedAt.getTime()}`}
              resourceId={resourceId}
              note={note}
            />
          ))}
        </div>
      )}
    </article>
  );
}
