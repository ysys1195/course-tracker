import type {
  LearningResourcePriority,
  LearningResourceStatus,
  ResourceType,
  StudyLogType,
} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { resourceStatusMeta, resourceTypeLabels } from '@/lib/resources';

const dashboardResourceSelect = {
  id: true,
  title: true,
  url: true,
  type: true,
  status: true,
  priority: true,
  updatedAt: true,
  resourceTags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  studyLogs: {
    orderBy: [{ studiedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      type: true,
      studyMinutes: true,
      studiedAt: true,
      createdAt: true,
    },
  },
} satisfies Prisma.LearningResourceSelect;

type DashboardResource = Prisma.LearningResourceGetPayload<{
  select: typeof dashboardResourceSelect;
}>;

export type DashboardSummaryCard = {
  key: LearningResourceStatus | ResourceType;
  label: string;
  value: number;
  tone: string;
};

export type DashboardFocusResource = {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  status: LearningResourceStatus;
  priority: LearningResourcePriority;
  updatedAt: Date;
  tagNames: string[];
  latestStudyLog?: {
    type: StudyLogType;
    studiedAt: Date;
    studyMinutes: number;
  };
};

export type DashboardWeeklyResource = DashboardFocusResource & {
  activityLabel: string;
  activityDate: Date;
};

export type DashboardData = {
  inProgressResources: DashboardFocusResource[];
  highPriorityResources: DashboardFocusResource[];
  weeklyResources: DashboardWeeklyResource[];
  statusSummary: DashboardSummaryCard[];
  typeSummary: DashboardSummaryCard[];
};

const statusDisplayOrder: LearningResourceStatus[] = [
  'IN_PROGRESS',
  'NOT_STARTED',
  'REVIEWING',
  'COMPLETED',
  'ON_HOLD',
];

const statusSummaryTone: Record<LearningResourceStatus, string> = {
  IN_PROGRESS: 'border-amber-200 bg-amber-100 text-amber-800',
  NOT_STARTED: 'border-slate-200 bg-slate-100 text-slate-700',
  REVIEWING: 'border-sky-200 bg-sky-100 text-sky-800',
  COMPLETED: 'border-emerald-200 bg-emerald-100 text-emerald-800',
  ON_HOLD: 'border-rose-200 bg-rose-100 text-rose-700',
};

const typeDisplayOrder: ResourceType[] = [
  'DOCS',
  'GITHUB',
  'VIDEO',
  'BOOK',
  'ARTICLE',
  'TUTORIAL',
];

const typeSummaryTone: Record<ResourceType, string> = {
  DOCS: 'border-teal-200 bg-teal-50 text-teal-700',
  GITHUB: 'border-slate-200 bg-slate-100 text-slate-700',
  VIDEO: 'border-orange-200 bg-orange-50 text-orange-700',
  BOOK: 'border-lime-200 bg-lime-50 text-lime-700',
  ARTICLE: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  TUTORIAL: 'border-violet-200 bg-violet-50 text-violet-700',
};

function getWeekStart(baseDate = new Date()) {
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + diff);

  return start;
}

function getPriorityRank(priority: LearningResourcePriority) {
  switch (priority) {
    case 'HIGH':
      return 0;
    case 'MEDIUM':
      return 1;
    case 'LOW':
    default:
      return 2;
  }
}

function toDashboardFocusResource(
  resource: DashboardResource
): DashboardFocusResource {
  const latestStudyLog = resource.studyLogs[0];

  return {
    id: resource.id,
    title: resource.title,
    url: resource.url,
    type: resource.type,
    status: resource.status,
    priority: resource.priority,
    updatedAt: resource.updatedAt,
    tagNames: resource.resourceTags.map(({ tag }) => tag.name),
    latestStudyLog: latestStudyLog
      ? {
          type: latestStudyLog.type,
          studiedAt: latestStudyLog.studiedAt,
          studyMinutes: latestStudyLog.studyMinutes,
        }
      : undefined,
  };
}

export async function getDashboardDataForUser(
  userId: string
): Promise<DashboardData> {
  const resources = await prisma.learningResource.findMany({
    where: {
      userId,
    },
    orderBy: [{ updatedAt: 'desc' }],
    select: dashboardResourceSelect,
  });
  const weekStart = getWeekStart();

  const statusCounts = new Map<LearningResourceStatus, number>(
    statusDisplayOrder.map((status) => [status, 0])
  );
  const typeCounts = new Map<ResourceType, number>(
    typeDisplayOrder.map((type) => [type, 0])
  );

  for (const resource of resources) {
    statusCounts.set(
      resource.status,
      (statusCounts.get(resource.status) ?? 0) + 1
    );
    typeCounts.set(resource.type, (typeCounts.get(resource.type) ?? 0) + 1);
  }

  const inProgressResources = resources
    .filter((resource) => resource.status === 'IN_PROGRESS')
    .sort((left, right) => {
      const priorityDiff =
        getPriorityRank(left.priority) - getPriorityRank(right.priority);

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return right.updatedAt.getTime() - left.updatedAt.getTime();
    })
    .slice(0, 4)
    .map(toDashboardFocusResource);

  const highPriorityResources = resources
    .filter(
      (resource) =>
        resource.priority === 'HIGH' && resource.status !== 'COMPLETED'
    )
    .sort((left, right) => {
      if (left.status === 'IN_PROGRESS' && right.status !== 'IN_PROGRESS') {
        return -1;
      }

      if (left.status !== 'IN_PROGRESS' && right.status === 'IN_PROGRESS') {
        return 1;
      }

      return right.updatedAt.getTime() - left.updatedAt.getTime();
    })
    .slice(0, 4)
    .map(toDashboardFocusResource);

  const weeklyResources = resources
    .map((resource) => {
      const latestWeeklyStudyLog = resource.studyLogs.find(
        (studyLog) =>
          studyLog.studiedAt >= weekStart || studyLog.createdAt >= weekStart
      );

      if (latestWeeklyStudyLog) {
        return {
          ...toDashboardFocusResource(resource),
          activityLabel: `${latestWeeklyStudyLog.studyMinutes}分の学習ログ`,
          activityDate:
            latestWeeklyStudyLog.studiedAt >= latestWeeklyStudyLog.createdAt
              ? latestWeeklyStudyLog.studiedAt
              : latestWeeklyStudyLog.createdAt,
        } satisfies DashboardWeeklyResource;
      }

      if (resource.updatedAt >= weekStart) {
        return {
          ...toDashboardFocusResource(resource),
          activityLabel: '教材情報を更新',
          activityDate: resource.updatedAt,
        } satisfies DashboardWeeklyResource;
      }

      return null;
    })
    .filter(
      (resource): resource is DashboardWeeklyResource => resource !== null
    )
    .sort(
      (left, right) =>
        right.activityDate.getTime() - left.activityDate.getTime()
    )
    .slice(0, 5);

  return {
    inProgressResources,
    highPriorityResources,
    weeklyResources,
    statusSummary: statusDisplayOrder.map((status) => ({
      key: status,
      label: resourceStatusMeta[status].label,
      value: statusCounts.get(status) ?? 0,
      tone: statusSummaryTone[status],
    })),
    typeSummary: typeDisplayOrder.map((type) => ({
      key: type,
      label: resourceTypeLabels[type],
      value: typeCounts.get(type) ?? 0,
      tone: typeSummaryTone[type],
    })),
  };
}
