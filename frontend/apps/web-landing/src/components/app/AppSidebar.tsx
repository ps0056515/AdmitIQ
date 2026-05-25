import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PhoneIncoming, 
  MessageSquareText, 
  Megaphone, 
  Workflow, 
  BarChart3, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../lib/auth';
import { useUIStore } from '../../lib/ui-store';
import { cn } from '@admitiq/ui';

const navItems = [
  { name: 'Overview', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Live Queue', href: '/app/live-queue', icon: PhoneIncoming },
  { name: 'Calls', href: '/app/calls', icon: MessageSquareText },
  { name: 'Campaigns', href: '/app/campaigns', icon: Megaphone },
  { name: 'Flow Builder', href: '/app/flows', icon: Workflow },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Users', href: '/app/users', icon: Users },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-full flex-col bg-background/40 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className={cn(
        "h-16 flex items-center border-b border-[var(--glass-border)]/50 transition-all duration-300",
        isSidebarCollapsed ? "justify-center px-0" : "px-6"
      )}>
        <Link to="/app/dashboard" className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-cyan-600 shadow-sm">
            <div className="absolute inset-[1px] rounded-[11px] bg-[var(--surface-overlay)]" />
            <span className="relative text-sm font-bold tracking-tighter text-foreground">
              IQ
            </span>
          </div>
          {!isSidebarCollapsed && (
            <span className="font-semibold text-[15px] tracking-tight text-foreground transition-opacity duration-300">
              AdmitIQ
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.name} className="relative group/nav-item">
              <Link
                to={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200 relative",
                  isSidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2",
                  isActive 
                    ? "bg-cyan-500/10 text-cyan-400" 
                    : "text-muted-foreground hover:bg-[var(--surface-overlay-hover)] hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "shrink-0 transition-colors",
                  isSidebarCollapsed ? "w-5 h-5" : "w-4 h-4",
                  isActive ? "text-cyan-400" : "text-muted-foreground group-hover/nav-item:text-foreground"
                )} />
                
                {!isSidebarCollapsed && (
                  <span className="text-[13px] font-medium">{item.name}</span>
                )}

                {/* Subtle active indicator */}
                {isActive && !isSidebarCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-400 rounded-r-full" />
                )}
                {isActive && isSidebarCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-400 rounded-r-full" />
                )}
              </Link>
              
              {/* Tooltip for Collapsed State */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[var(--surface-overlay)] border border-[var(--glass-border)] text-foreground text-xs font-medium rounded-md shadow-lg opacity-0 invisible group-hover/nav-item:opacity-100 group-hover/nav-item:visible transition-all duration-200 z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-3 border-t border-[var(--glass-border)] relative">
        {user && (
          <div className={cn(
            "flex items-center rounded-xl border border-transparent transition-all duration-300 relative group",
            isSidebarCollapsed ? "justify-center p-2 cursor-pointer hover:bg-[var(--surface-overlay-hover)]" : "p-2 gap-3 hover:bg-[var(--surface-overlay-hover)] hover:border-[var(--glass-border)] cursor-pointer"
          )} onClick={() => isSidebarCollapsed ? logout() : undefined}>
            <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--surface-overlay)] border border-[var(--glass-border)] flex items-center justify-center text-foreground font-semibold text-xs relative">
              {user.name.charAt(0)}
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-background" />
            </div>
            
            {!isSidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate leading-tight">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.role}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    logout();
                  }}
                  className="p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all rounded-md"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
            
            {/* Tooltip for Collapsed Logout */}
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-[var(--surface-overlay)] border border-[var(--glass-border)] text-foreground text-xs font-medium rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap flex items-center gap-2">
                <LogOut className="w-3 h-3 text-rose-400" />
                Logout
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
