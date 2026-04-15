'use client';

import { useFormStatus } from 'react-dom';

type MoveItemButtonProps = {
  direction: 'up' | 'down';
  disabled?: boolean;
};

export function MoveItemButton({
  direction,
  disabled = false,
}: MoveItemButtonProps) {
  const { pending } = useFormStatus();
  const label = direction === 'up' ? '上へ移動' : '下へ移動';

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center justify-center rounded-full border border-ink/12 bg-white px-4 py-2 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? '更新中...' : label}
    </button>
  );
}
