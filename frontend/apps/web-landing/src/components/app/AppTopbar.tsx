import { Search, Bell, Command, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useUIStore } from '../../lib/ui-store';

export function AppTopbar() {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-center bg-[var(--surface-overlay)]/30 backdrop-blur-xl">
      <div className="flex w-full max-w-[1600px] mx-auto items-center justify-between gap-4">
        
        {/* LEFT: Sidebar Toggle, Search, Command, Theme */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-[var(--surface-overlay-hover)] border border-transparent hover:border-[var(--glass-border)] shrink-0"
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 sm:w-5 sm:h-5" /> : <PanelLeftClose className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 bg-background/50 border border-[var(--glass-border)] rounded-lg text-sm text-muted-foreground hover:bg-[var(--surface-overlay-hover)] hover:border-[var(--glass-border-hover)] transition-all duration-300 w-full max-w-xs group shadow-sm">
            <Search className="w-4 h-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Search leads, campaigns...</span>
            <div className="ml-auto hidden sm:flex items-center gap-1 shrink-0">
              <kbd className="h-5 items-center gap-1 rounded border border-[var(--glass-border)] bg-[var(--surface-overlay)] px-1.5 font-mono text-[10px] font-medium text-muted-foreground group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors inline-flex">
                <Command className="w-3 h-3" /> K
              </kbd>
            </div>
          </button>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>

        {/* RIGHT: Notifications, Tenant, Profile */}
        <div className="flex items-center justify-end flex-1 gap-2 sm:gap-4 min-w-0">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-[var(--surface-overlay-hover)] shrink-0 border border-transparent hover:border-[var(--glass-border)]">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-500 border border-background shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </button>

          <div className="h-6 w-px bg-[var(--glass-border)] mx-1" />

          {/* Tenant Selector */}
          <button className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-[var(--surface-overlay-hover)] border border-transparent hover:border-[var(--glass-border)] transition-all shrink-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm">
              DT
            </div>
            <div className="flex flex-col items-start text-left mr-1 hidden sm:flex leading-tight">
              <span className="text-[12px] font-semibold text-foreground truncate max-w-[120px]">Delhi Tech Univ</span>
            </div>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hidden sm:block" />
          </button>
        </div>

      </div>
    </div>
  );
}
