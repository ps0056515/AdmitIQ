import * as React from 'react';
import { cn } from '../../lib/utils';

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  isSidebarCollapsed?: boolean;
}

export function AppShell({
  sidebar,
  header,
  children,
  isSidebarCollapsed = false,
  className,
  ...props
}: AppShellProps) {
  return (
    <div className={cn("flex h-screen overflow-hidden bg-background text-foreground", className)} {...props}>
      {/* Sidebar Area */}
      {sidebar && (
        <aside
          className={cn(
            "flex-shrink-0 z-50 flex flex-col border-r border-[var(--glass-border)] bg-[var(--surface-overlay)] transition-all duration-300",
            isSidebarCollapsed ? "w-[72px]" : "w-64"
          )}
        >
          {sidebar}
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 relative h-full">
        {/* Header Area */}
        {header && (
          <header className="sticky top-0 z-40 w-full border-b border-[var(--glass-border)] bg-background/80 backdrop-blur-md">
            {header}
          </header>
        )}

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 relative">
          <div className="absolute top-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.05),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 w-full max-w-[1600px] mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
