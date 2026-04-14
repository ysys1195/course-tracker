import type {
  LearningResourcePriority,
  LearningResourceStatus,
  ResourceType,
} from '@prisma/client';

export const resourceTypeLabels: Record<ResourceType, string> = {
  DOCS: '公式 Docs',
  GITHUB: '公式 GitHub',
  VIDEO: '動画',
  BOOK: '書籍',
  ARTICLE: '記事',
  TUTORIAL: 'チュートリアル',
};

export const resourceStatusMeta: Record<
  LearningResourceStatus,
  { label: string; className: string }
> = {
  NOT_STARTED: {
    label: '未着手',
    className: 'border-slate-200 bg-slate-100 text-slate-700',
  },
  IN_PROGRESS: {
    label: '学習中',
    className: 'border-amber-200 bg-amber-100 text-amber-800',
  },
  COMPLETED: {
    label: '完了',
    className: 'border-emerald-200 bg-emerald-100 text-emerald-800',
  },
  REVIEWING: {
    label: '復習中',
    className: 'border-sky-200 bg-sky-100 text-sky-800',
  },
  ON_HOLD: {
    label: '保留',
    className: 'border-rose-200 bg-rose-100 text-rose-700',
  },
};

export const resourcePriorityMeta: Record<
  LearningResourcePriority,
  { label: string; className: string }
> = {
  LOW: {
    label: '低',
    className: 'border-slate-200 bg-white text-slate-600',
  },
  MEDIUM: {
    label: '中',
    className: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  },
  HIGH: {
    label: '高',
    className: 'border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700',
  },
};

export function formatUpdatedAt(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
