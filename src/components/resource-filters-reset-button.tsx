'use client';

import { useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { defaultResourceSort } from '@/lib/resources';

export function ResourceFiltersResetButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const form = buttonRef.current?.form;

    if (form) {
      const q = form.elements.namedItem('q');
      const type = form.elements.namedItem('type');
      const status = form.elements.namedItem('status');
      const priority = form.elements.namedItem('priority');
      const sort = form.elements.namedItem('sort');

      if (q instanceof HTMLInputElement) {
        q.value = '';
      }

      if (type instanceof HTMLSelectElement) {
        type.value = '';
      }

      if (status instanceof HTMLSelectElement) {
        status.value = '';
      }

      if (priority instanceof HTMLSelectElement) {
        priority.value = '';
      }

      if (sort instanceof HTMLSelectElement) {
        sort.value = defaultResourceSort;
      }
    }

    startTransition(() => {
      router.push('/resources');
    });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-full border border-ink/12 px-5 py-3 text-sm text-ink/72 transition hover:bg-ink/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      クリア
    </button>
  );
}
