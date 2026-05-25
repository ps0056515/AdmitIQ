import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  isLive?: boolean;
}

export function MetricCard({ title, value, trend, icon, isLive, className, ...props }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-xl p-4 hover:bg-[var(--surface-overlay-hover)] hover:border-[var(--glass-border-hover)] transition-all duration-300 relative overflow-hidden group shadow-sm flex flex-col justify-between min-h-[120px]", className)}
      {...(props as any)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          {title}
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </h3>
        {icon && <div className="text-muted-foreground/60">{icon}</div>}
      </div>
      
      <div className="relative z-10 flex items-end justify-between mt-auto">
        <div>
          <div className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-1">{value}</div>
          {trend && (
            <div className="flex items-center gap-1.5 text-[11px] lg:text-[12px]">
              <span className={cn(
                "font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                trend.isPositive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-muted-foreground whitespace-nowrap truncate">{trend.label}</span>
            </div>
          )}
        </div>
        
        {/* Abstract Sparkline / Visual Density */}
        {trend && (
          <div className="hidden sm:flex items-end gap-[2px] h-8 opacity-40 group-hover:opacity-80 transition-opacity">
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-1.5 rounded-t-sm bg-current",
                  trend.isPositive ? "text-emerald-500" : "text-rose-500"
                )} 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
