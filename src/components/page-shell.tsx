import type { ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-visible px-4 py-6 sm:px-6 sm:py-8">
      {/* Faint turquoise glow behind the center content */}
      <div className="glow-turquoise" />

      <div className="relative">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
        </header>
        {children}
      </div>
    </div>
  );
}
