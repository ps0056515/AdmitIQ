import * as React from 'react';
import { cn } from '../../lib/utils';

export type StatusBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusBadgeVariant;
  pulse?: boolean;
}

export function StatusBadge({ 
  variant = 'neutral', 
  pulse = false, 
  className, 
  children, 
  ...props 
}: StatusBadgeProps) {
  
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    info: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    neutral: 'bg-foreground/5 text-muted-foreground border-foreground/10',
  };

  const dots = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-cyan-500',
    neutral: 'bg-muted-foreground',
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dots[variant])} />
        )}
        <span className={cn("relative inline-flex rounded-full h-2 w-2", dots[variant])} />
      </span>
      {children}
    </span>
  );
}
