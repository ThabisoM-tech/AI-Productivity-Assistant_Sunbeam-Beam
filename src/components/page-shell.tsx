import type { ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-visible px-4 py-6 sm:px-6 sm:py-8">
      <div className="glow-turquoise" />
      <div className="relative">
        <header className="mb-6 sm:mb-8">
          <div className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </div>
          {subtitle && (
            <div className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</div>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
