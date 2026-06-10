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
      {/* Faint turquoise glow behind the center content */}
      <div className="glow-turquoise" />

      <div className="relative">
        <header className="mb-6 sm:mb-8">
          <div className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</div>
          {subtitle && <div className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</div>}
        </header>
        {children}
      </div>
    </div>
  );
}

