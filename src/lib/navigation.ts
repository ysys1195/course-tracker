export const appNavigationItems = [
  {
    href: '/dashboard',
    label: 'ダッシュボード',
    shortLabel: 'ホーム',
    description: '全体状況',
  },
  {
    href: '/resources',
    label: '教材一覧',
    shortLabel: '教材',
    description: '学習教材',
  },
  {
    href: '/paths',
    label: 'ロードマップ',
    shortLabel: '計画',
    description: '学習計画',
  },
  {
    href: '/settings',
    label: '設定',
    shortLabel: '設定',
    description: 'アカウント',
  },
] as const;
