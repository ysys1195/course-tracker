import type { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  variant?: 'default' | 'hero';
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  variant = 'default',
}: PageHeaderProps) {
  const baseClassName =
    variant === 'hero'
      ? 'rounded-[2rem] bg-[linear-gradient(135deg,_#122023_0%,_#18333a_58%,_#0f766e_100%)] p-8 text-white shadow-soft sm:p-10'
      : 'rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft sm:p-10';

  const eyebrowClassName =
    variant === 'hero'
      ? 'text-sm tracking-[0.2em] text-white/70'
      : 'text-sm tracking-[0.2em] text-signal';

  const descriptionClassName =
    variant === 'hero'
      ? 'mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base'
      : 'mt-4 max-w-2xl text-sm leading-7 text-ink/70';

  return (
    <section className={baseClassName}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={eyebrowClassName}>{eyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className={descriptionClassName}>{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 flex-col gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
