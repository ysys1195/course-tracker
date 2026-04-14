"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavigationItems } from "@/lib/navigation";

type AppNavigationProps = {
  mobile?: boolean;
};

export function AppNavigation({ mobile = false }: AppNavigationProps) {
  const pathname = usePathname();
  const navClassName = mobile ? 'grid grid-cols-4 gap-2' : 'grid gap-2';

  return (
    <nav aria-label="主要ナビゲーション" className={navClassName}>
      {appNavigationItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const linkClassName = mobile
          ? [
              'inline-flex min-h-16 items-center justify-center rounded-2xl px-3 text-center text-xs font-medium transition',
              isActive
                ? 'bg-ink text-white shadow-soft'
                : 'bg-white/80 text-ink/72 hover:bg-white hover:text-ink',
            ].join(' ')
          : [
              'inline-flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition',
              isActive
                ? 'bg-ink text-white shadow-soft'
                : 'bg-transparent text-ink/72 hover:bg-ink/5 hover:text-ink',
            ].join(' ');

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={linkClassName}
          >
            <span>{mobile ? item.shortLabel : item.label}</span>
            {mobile ? null : (
              <span className={isActive ? 'text-white/72' : 'text-ink/40'}>
                /
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
