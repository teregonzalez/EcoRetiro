import React from "react";

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}

interface DashboardShellProps {
  appName: string;
  panelTitle: string;
  subtitle: string;
  username: string;
  roleLabel: string;
  navItems: NavItem[];
  topTabs: string[];
  activeTopTab: string;
  ctaLabel?: string;
  onTopTabChange?: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function DashboardShell({
  appName,
  panelTitle,
  subtitle,
  username,
  roleLabel,
  navItems,
  topTabs,
  activeTopTab,
  ctaLabel,
  onTopTabChange,
  onLogout,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <aside className="fixed left-0 top-0 hidden h-screen w-[280px] flex-col border-r border-outline-variant bg-surface-container-low py-md md:flex">
        <div className="mb-lg px-md">
          <h1 className="font-headline-lg-mobile font-black text-primary">{appName}</h1>
          <p className="mt-1 text-label-sm uppercase tracking-widest text-on-surface-variant">{panelTitle}</p>
        </div>

        <nav className="flex flex-1 flex-col px-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                item.active
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-outline-variant px-md pt-md">
          {ctaLabel && (
            <button
              type="button"
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-label-sm text-label-sm text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">add</span>
              {ctaLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-error py-2 font-label-sm text-error transition-colors hover:bg-error/5"
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar Sesion
          </button>
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col md:ml-[280px]">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin shadow-sm">
          <div>
            <h2 className="font-headline-lg-mobile text-on-surface">{panelTitle}</h2>
            <p className="text-body-md text-on-surface-variant">{subtitle}</p>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {topTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTopTabChange?.(tab)}
                className={`pb-1 text-body-md transition-colors ${
                  tab === activeTopTab
                    ? "border-b-2 border-secondary font-bold text-secondary"
                    : "text-on-surface-variant hover:text-secondary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-md">
            <button type="button" className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button type="button" className="hidden rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container sm:block">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="flex items-center gap-sm border-l border-outline-variant pl-md">
              <div className="hidden text-right sm:block">
                <p className="font-label-sm font-bold text-on-surface">{username}</p>
                <p className="text-[10px] text-on-surface-variant">{roleLabel}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 p-margin">{children}</section>
      </main>
    </div>
  );
}
