import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const targetEmail = process.env.SEED_USER_EMAIL || 'demo@coursetracker.local';
const targetName = process.env.SEED_USER_NAME || 'CourseTracker Demo';

function scopedId(userId, key) {
  return `seed-${userId}-${key}`;
}

function daysAgo(days, hour = 9, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

const resourceSeeds = [
  {
    key: 'resource-nextjs-docs',
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    provider: 'Vercel',
    description:
      'App Router、データ取得、デプロイまでを一通り確認するための公式ドキュメントです。',
    type: 'DOCS',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    tags: ['Next.js', 'App Router', 'Frontend'],
    notes: [
      {
        key: 'note-nextjs-routing',
        title: 'App Router の整理',
        content:
          'レイアウト、ローディング、エラーハンドリングが route segment 単位で設計できる。画面ごとの責務分離がしやすい。',
      },
    ],
    studyLogs: [
      {
        key: 'log-nextjs-start',
        type: 'START',
        studyMinutes: 40,
        studiedAt: () => daysAgo(6, 9, 0),
        understandingNote:
          '公式チュートリアルの構成を追いながら、App Router の基本を把握した。',
      },
      {
        key: 'log-nextjs-progress',
        type: 'PROGRESS',
        studyMinutes: 55,
        studiedAt: () => daysAgo(1, 11, 30),
        understandingNote:
          'Server Components と Server Actions の責務分担が見えてきた。フォーム周りをもう一度見直したい。',
      },
    ],
  },
  {
    key: 'resource-react-docs',
    title: 'React Documentation',
    url: 'https://react.dev/',
    provider: 'React Team',
    description:
      'React の基本概念、Hooks、レンダリングモデルを確認するための公式ドキュメントです。',
    type: 'DOCS',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    tags: ['React', 'Hooks', 'Frontend'],
    notes: [
      {
        key: 'note-react-effects',
        title: 'Effect を減らす指針',
        content:
          'ドキュメントの「You Might Not Need an Effect」を読むと、状態の持ち方をかなり整理できる。',
      },
    ],
    studyLogs: [
      {
        key: 'log-react-progress',
        type: 'PROGRESS',
        studyMinutes: 35,
        studiedAt: () => daysAgo(2, 10, 0),
        understandingNote:
          'state の設計と再レンダリングの考え方を復習した。derived state を増やしすぎないのが重要。',
      },
    ],
  },
  {
    key: 'resource-prisma-docs',
    title: 'Prisma Documentation',
    url: 'https://www.prisma.io/docs',
    provider: 'Prisma',
    description:
      'Schema、migrate、relation、query の基礎を確認するための公式ドキュメントです。',
    type: 'DOCS',
    status: 'REVIEWING',
    priority: 'HIGH',
    tags: ['Prisma', 'Database', 'Backend'],
    notes: [
      {
        key: 'note-prisma-relations',
        title: 'Relation 設計メモ',
        content:
          '関連モデルを増やすときは Prisma schema だけでなく、一覧取得の select と整合を取る必要がある。',
      },
    ],
    studyLogs: [
      {
        key: 'log-prisma-review',
        type: 'REVIEW',
        studyMinutes: 30,
        studiedAt: () => daysAgo(5, 8, 30),
        understandingNote:
          'migration の作り方と seed の位置づけを再確認した。ローカル DB の初期化導線も理解できた。',
      },
    ],
  },
  {
    key: 'resource-typescript-docs',
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    provider: 'TypeScript',
    description:
      'TypeScript の型システム、narrowing、generics を見直すための公式ハンドブックです。',
    type: 'DOCS',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    tags: ['TypeScript', 'Type Safety'],
    notes: [],
    studyLogs: [],
  },
  {
    key: 'resource-nextjs-repo',
    title: 'vercel/next.js',
    url: 'https://github.com/vercel/next.js',
    provider: 'GitHub',
    description:
      'Next.js 本体実装や examples ディレクトリを読むための公式 GitHub リポジトリです。',
    type: 'GITHUB',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    tags: ['Next.js', 'Open Source', 'Examples'],
    notes: [],
    studyLogs: [],
  },
  {
    key: 'resource-react-repo',
    title: 'facebook/react',
    url: 'https://github.com/facebook/react',
    provider: 'GitHub',
    description:
      'React 本体と RFC 周辺を追うための公式 GitHub リポジトリです。',
    type: 'GITHUB',
    status: 'ON_HOLD',
    priority: 'LOW',
    tags: ['React', 'Open Source'],
    notes: [],
    studyLogs: [],
  },
  {
    key: 'resource-prisma-repo',
    title: 'prisma/prisma',
    url: 'https://github.com/prisma/prisma',
    provider: 'GitHub',
    description:
      'Prisma ORM の issue や examples、CLI 周辺の実装を見るための公式 GitHub リポジトリです。',
    type: 'GITHUB',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    tags: ['Prisma', 'Open Source', 'ORM'],
    notes: [
      {
        key: 'note-prisma-cli',
        title: 'CLI まわりの観察',
        content:
          'schema 更新から client generate までの流れが揃っていて、ローカル開発体験を意識した作りになっている。',
      },
    ],
    studyLogs: [
      {
        key: 'log-prisma-complete',
        type: 'COMPLETE',
        studyMinutes: 25,
        studiedAt: () => daysAgo(7, 13, 0),
        understandingNote:
          '欲しかった情報まで読み終えた。今後は必要時に issue や discussion を参照すれば十分そう。',
      },
    ],
  },
];

const learningPathSeeds = [
  {
    key: 'path-nextjs-fullstack',
    title: 'Next.js Full-Stack Roadmap',
    description:
      'React 基礎から Next.js、Prisma までを順番に確認するロードマップです。',
    status: 'ACTIVE',
    items: [
      {
        resourceKey: 'resource-react-docs',
        position: 1,
        note: 'React の基本設計を先に固める。',
      },
      {
        resourceKey: 'resource-nextjs-docs',
        position: 2,
        note: 'App Router と Server Components を中心に読む。',
      },
      {
        resourceKey: 'resource-prisma-docs',
        position: 3,
        note: 'データモデルと migration の扱いを整理する。',
      },
      {
        resourceKey: 'resource-nextjs-repo',
        position: 4,
        note: '公式 examples を見て実装パターンを補強する。',
      },
    ],
  },
  {
    key: 'path-open-source-reading',
    title: 'Open Source Reading Path',
    description:
      '主要 OSS リポジトリを読みながら、実装と設計のパターンを観察するロードマップです。',
    status: 'PLANNED',
    items: [
      {
        resourceKey: 'resource-nextjs-repo',
        position: 1,
        note: 'examples と app ディレクトリ関連から入る。',
      },
      {
        resourceKey: 'resource-prisma-repo',
        position: 2,
        note: 'CLI と schema 周辺のコードを優先する。',
      },
      {
        resourceKey: 'resource-react-repo',
        position: 3,
        note: '必要になった箇所だけ絞って読む。',
      },
    ],
  },
];

async function ensureUser() {
  const existingUser = await prisma.user.findUnique({
    where: { email: targetEmail },
  });

  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: { name: targetName },
    });
  }

  return prisma.user.create({
    data: {
      name: targetName,
      email: targetEmail,
    },
  });
}

async function seedTags(userId) {
  const tagNames = [...new Set(resourceSeeds.flatMap((resource) => resource.tags))];
  const tagIdMap = new Map();

  for (const tagName of tagNames) {
    const tag = await prisma.tag.upsert({
      where: {
        userId_name: {
          userId,
          name: tagName,
        },
      },
      update: {},
      create: {
        id: scopedId(
          userId,
          `tag-${tagName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`
        ),
        userId,
        name: tagName,
      },
    });

    tagIdMap.set(tagName, tag.id);
  }

  return tagIdMap;
}

async function seedResources(userId, tagIdMap) {
  const resourceIdMap = new Map();

  for (const resourceSeed of resourceSeeds) {
    const resource = await prisma.learningResource.upsert({
      where: {
        userId_url: {
          userId,
          url: resourceSeed.url,
        },
      },
      update: {
        title: resourceSeed.title,
        url: resourceSeed.url,
        provider: resourceSeed.provider,
        description: resourceSeed.description,
        type: resourceSeed.type,
        status: resourceSeed.status,
        priority: resourceSeed.priority,
      },
      create: {
        id: scopedId(userId, resourceSeed.key),
        userId,
        title: resourceSeed.title,
        url: resourceSeed.url,
        provider: resourceSeed.provider,
        description: resourceSeed.description,
        type: resourceSeed.type,
        status: resourceSeed.status,
        priority: resourceSeed.priority,
      },
    });

    const resourceId = resource.id;
    resourceIdMap.set(resourceSeed.key, resourceId);

    await prisma.resourceTag.deleteMany({
      where: { resourceId },
    });

    for (const tagName of resourceSeed.tags) {
      await prisma.resourceTag.upsert({
        where: {
          resourceId_tagId: {
            resourceId,
            tagId: tagIdMap.get(tagName),
          },
        },
        update: {},
        create: {
          resourceId,
          tagId: tagIdMap.get(tagName),
        },
      });
    }

    for (const noteSeed of resourceSeed.notes) {
      await prisma.note.upsert({
        where: { id: scopedId(userId, noteSeed.key) },
        update: {
          title: noteSeed.title,
          content: noteSeed.content,
          resourceId,
          userId,
        },
        create: {
          id: scopedId(userId, noteSeed.key),
          userId,
          resourceId,
          title: noteSeed.title,
          content: noteSeed.content,
        },
      });
    }

    for (const logSeed of resourceSeed.studyLogs) {
      await prisma.studyLog.upsert({
        where: { id: scopedId(userId, logSeed.key) },
        update: {
          resourceId,
          userId,
          type: logSeed.type,
          studyMinutes: logSeed.studyMinutes,
          understandingNote: logSeed.understandingNote,
          studiedAt: logSeed.studiedAt(),
        },
        create: {
          id: scopedId(userId, logSeed.key),
          userId,
          resourceId,
          type: logSeed.type,
          studyMinutes: logSeed.studyMinutes,
          understandingNote: logSeed.understandingNote,
          studiedAt: logSeed.studiedAt(),
        },
      });
    }
  }

  return resourceIdMap;
}

async function cleanupMissingSeedRecords(userId) {
  const noteIds = resourceSeeds.flatMap((resource) =>
    resource.notes.map((note) => scopedId(userId, note.key)),
  );
  const studyLogIds = resourceSeeds.flatMap((resource) =>
    resource.studyLogs.map((log) => scopedId(userId, log.key)),
  );
  const pathIds = learningPathSeeds.map((path) => scopedId(userId, path.key));
  const pathItemIds = learningPathSeeds.flatMap((path) =>
    path.items.map((item) =>
      scopedId(userId, `${path.key}-${item.position}-${item.resourceKey}`),
    ),
  );

  await prisma.learningPathItem.deleteMany({
    where: {
      learningPathId: { in: pathIds },
      id: { notIn: pathItemIds.length > 0 ? pathItemIds : ['__none__'] },
    },
  });

  await prisma.note.deleteMany({
    where: {
      userId,
      id: { startsWith: `seed-${userId}-note-`, notIn: noteIds.length > 0 ? noteIds : ['__none__'] },
    },
  });

  await prisma.studyLog.deleteMany({
    where: {
      userId,
      id: {
        startsWith: `seed-${userId}-log-`,
        notIn: studyLogIds.length > 0 ? studyLogIds : ['__none__'],
      },
    },
  });
}

async function seedLearningPaths(userId, resourceIdMap) {
  for (const pathSeed of learningPathSeeds) {
    const learningPathId = scopedId(userId, pathSeed.key);

    await prisma.learningPath.upsert({
      where: { id: learningPathId },
      update: {
        title: pathSeed.title,
        description: pathSeed.description,
        status: pathSeed.status,
      },
      create: {
        id: learningPathId,
        userId,
        title: pathSeed.title,
        description: pathSeed.description,
        status: pathSeed.status,
      },
    });

    for (const itemSeed of pathSeed.items) {
      await prisma.learningPathItem.upsert({
        where: {
          id: scopedId(
            userId,
            `${pathSeed.key}-${itemSeed.position}-${itemSeed.resourceKey}`,
          ),
        },
        update: {
          learningPathId,
          resourceId: resourceIdMap.get(itemSeed.resourceKey),
          position: itemSeed.position,
          note: itemSeed.note,
        },
        create: {
          id: scopedId(
            userId,
            `${pathSeed.key}-${itemSeed.position}-${itemSeed.resourceKey}`,
          ),
          learningPathId,
          resourceId: resourceIdMap.get(itemSeed.resourceKey),
          position: itemSeed.position,
          note: itemSeed.note,
        },
      });
    }
  }
}

async function main() {
  const user = await ensureUser();
  const tagIdMap = await seedTags(user.id);
  const resourceIdMap = await seedResources(user.id, tagIdMap);
  await seedLearningPaths(user.id, resourceIdMap);
  await cleanupMissingSeedRecords(user.id);

  console.log(`Seeded demo data for ${targetEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
