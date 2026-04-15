import type {
  LearningResourcePriority,
  LearningResourceStatus,
  ResourceType,
} from '@prisma/client';
import { z } from 'zod';

export const resourceTypeOptions: ReadonlyArray<{
  value: ResourceType;
  label: string;
}> = [
  { value: 'DOCS', label: '公式 Docs' },
  { value: 'GITHUB', label: '公式 GitHub' },
  { value: 'VIDEO', label: '動画' },
  { value: 'BOOK', label: '書籍' },
  { value: 'ARTICLE', label: '記事' },
  { value: 'TUTORIAL', label: 'チュートリアル' },
];

export const resourceTypeLabels: Record<ResourceType, string> = {
  DOCS: '公式 Docs',
  GITHUB: '公式 GitHub',
  VIDEO: '動画',
  BOOK: '書籍',
  ARTICLE: '記事',
  TUTORIAL: 'チュートリアル',
};

export const resourceTypeValues = resourceTypeOptions.map(
  (option) => option.value,
) as [ResourceType, ...ResourceType[]];

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

export const resourceStatusOptions: ReadonlyArray<{
  value: LearningResourceStatus;
  label: string;
}> = [
  { value: 'NOT_STARTED', label: '未着手' },
  { value: 'IN_PROGRESS', label: '学習中' },
  { value: 'COMPLETED', label: '完了' },
  { value: 'REVIEWING', label: '復習中' },
  { value: 'ON_HOLD', label: '保留' },
];

export const resourceStatusValues = resourceStatusOptions.map(
  (option) => option.value,
) as [LearningResourceStatus, ...LearningResourceStatus[]];

export const resourceStatusOnlySchema = z.object({
  status: z.enum(resourceStatusValues, {
    error: 'ステータスを選択してください。',
  }),
});

export type StatusUpdateState = {
  message?: string;
  type?: 'success' | 'error';
};

export const initialStatusUpdateState: StatusUpdateState = {};

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

export const resourcePriorityOptions: ReadonlyArray<{
  value: LearningResourcePriority;
  label: string;
}> = [
  { value: 'LOW', label: '低' },
  { value: 'MEDIUM', label: '中' },
  { value: 'HIGH', label: '高' },
];

export const resourcePriorityValues = resourcePriorityOptions.map(
  (option) => option.value,
) as [LearningResourcePriority, ...LearningResourcePriority[]];

export const resourceSortOptions = [
  { value: 'updatedAt_desc', label: '更新日が新しい順' },
  { value: 'updatedAt_asc', label: '更新日が古い順' },
  { value: 'priority_desc', label: '優先度が高い順' },
  { value: 'priority_asc', label: '優先度が低い順' },
] as const;

export type ResourceSortKey = (typeof resourceSortOptions)[number]['value'];

export const resourceSortLabels: Record<ResourceSortKey, string> = {
  updatedAt_desc: '更新日が新しい順',
  updatedAt_asc: '更新日が古い順',
  priority_desc: '優先度が高い順',
  priority_asc: '優先度が低い順',
};

export const defaultResourceSort: ResourceSortKey = 'updatedAt_desc';

const resourceSortValues = resourceSortOptions.map(
  (option) => option.value,
) as [ResourceSortKey, ...ResourceSortKey[]];

export type ResourceListFilters = {
  q: string;
  type?: ResourceType;
  status?: LearningResourceStatus;
  priority?: LearningResourcePriority;
  sort: ResourceSortKey;
};

export type ResourceListSearchParams = Partial<
  Record<'q' | 'type' | 'status' | 'priority' | 'sort', string | string[]>
>;

type ResourceFilterChip = {
  key: string;
  label: string;
  value: string;
};

const resourceListFiltersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  type: z.enum(resourceTypeValues).optional(),
  status: z.enum(resourceStatusValues).optional(),
  priority: z.enum(resourcePriorityValues).optional(),
  sort: z.enum(resourceSortValues).default(defaultResourceSort),
});

function getSingleSearchParamValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function normalizeSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  const normalized = getSingleSearchParamValue(value)?.trim();

  return normalized ? normalized : undefined;
}

export function parseResourceListFilters(
  searchParams?: ResourceListSearchParams,
): ResourceListFilters {
  const parsed = resourceListFiltersSchema.safeParse({
    q: normalizeSearchParam(searchParams?.q),
    type: normalizeSearchParam(searchParams?.type),
    status: normalizeSearchParam(searchParams?.status),
    priority: normalizeSearchParam(searchParams?.priority),
    sort: normalizeSearchParam(searchParams?.sort),
  });

  if (!parsed.success) {
    return {
      q: '',
      sort: defaultResourceSort,
    };
  }

  return {
    q: parsed.data.q ?? '',
    type: parsed.data.type,
    status: parsed.data.status,
    priority: parsed.data.priority,
    sort: parsed.data.sort,
  };
}

export function getActiveResourceFilterChips(
  filters: ResourceListFilters,
): ResourceFilterChip[] {
  const chips: ResourceFilterChip[] = [];

  if (filters.q) {
    chips.push({
      key: 'q',
      label: '検索',
      value: filters.q,
    });
  }

  if (filters.type) {
    chips.push({
      key: 'type',
      label: '種別',
      value: resourceTypeLabels[filters.type],
    });
  }

  if (filters.status) {
    chips.push({
      key: 'status',
      label: 'ステータス',
      value: resourceStatusMeta[filters.status].label,
    });
  }

  if (filters.priority) {
    chips.push({
      key: 'priority',
      label: '優先度',
      value: resourcePriorityMeta[filters.priority].label,
    });
  }

  if (filters.sort !== defaultResourceSort) {
    chips.push({
      key: 'sort',
      label: '並び順',
      value: resourceSortLabels[filters.sort],
    });
  }

  return chips;
}

export function formatUpdatedAt(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
