import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { Link } from 'react-router-dom';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-foreground overflow-hidden">
      
      {/* ─── LEFT PANEL (Operational Narrative) ─── */}
      <div className="relative hidden lg:flex flex-col justify-between w-[45%] xl:w-[50%] bg-[var(--surface-overlay)] border-r border-[var(--glass-border)] p-12 overflow-hidden">
        
        {/* Background Gradients & Textures */}
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300 group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" fill="white" />
                <circle cx="12" cy="12" r="2" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">AdmitIQ</span>
          </Link>
        </div>

        {/* Center Content / Floating Mockups */}
        <div className="relative z-10 flex-1 flex flex-col justify-center my-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Every admission inquiry <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                answered in minutes.
              </span>
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md leading-relaxed mb-12">
              Real-time AI admissions infrastructure. Multilingual qualification at enterprise scale. Deploy your autonomous voice agent today.
            </p>
          </motion.div>

          {/* Floating Operational Cards */}
          <div className="relative h-[240px] w-full max-w-lg mt-4">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
              transition={{ 
                opacity: { delay: 0.2, duration: 0.8 },
                x: { delay: 0.2, duration: 0.8 },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute top-0 left-0 glass-strong p-5 rounded-2xl border border-[var(--glass-border)] w-[250px] shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <Zap className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Speed to Lead</div>
                  <div className="text-xl font-bold text-foreground">{'<'} 3 Minutes</div>
                </div>
              </div>
              <div className="w-full h-1.5 bg-[var(--surface-overlay)] rounded-full overflow-hidden mt-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-cyan-400 rounded-full"
                />
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
              transition={{ 
                opacity: { delay: 0.4, duration: 0.8 },
                x: { delay: 0.4, duration: 0.8 },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }
              }}
              className="absolute top-[90px] right-4 glass-strong p-5 rounded-2xl border border-[var(--glass-border)] w-[270px] shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4.5 h-4.5 text-emerald-400" />
                  <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">Contact Rate</span>
                </div>
                <span className="text-emerald-400 text-[11px] font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">+42%</span>
              </div>
              <div className="flex items-end gap-2.5">
                <span className="text-4xl font-bold text-foreground leading-none tracking-tight">85.4%</span>
                <span className="text-[12px] text-muted-foreground pb-1 font-medium">avg. engagement</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-[12px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-2 h-2">
              <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping" />
              <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            </div>
            <span className="font-medium text-foreground/80">All systems operational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>SOC 2 Type II Compliant</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL (Form Area) ─── */}
      <div className="relative flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        
        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50">
          <ThemeToggle />
        </div>

        {/* Mobile Logo (visible only on small screens) */}
        <div className="lg:hidden absolute top-6 left-6 z-50">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" fill="white" />
                  <circle cx="12" cy="12" r="2" fill="white" />
                </svg>
            </div>
            <span className="font-bold text-foreground tracking-tight">AdmitIQ</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[400px] mt-16 lg:mt-0 relative z-10">
          {children}
        </div>

      </div>
    </div>
  );
}
