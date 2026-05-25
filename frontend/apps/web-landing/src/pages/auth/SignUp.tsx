import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, User, Mail, Lock } from 'lucide-react';

export function SignUp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Create your account</h2>
        <p className="text-[14px] text-muted-foreground">
          Join leading institutions automating their admissions orchestration.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground ml-1">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-muted-foreground/50" />
              </div>
              <input
                type="text"
                placeholder="Ravi"
                className="w-full bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder:text-muted-foreground/50 hover:bg-[var(--surface-overlay-hover)]"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-foreground ml-1">Last Name</label>
            <input
              type="text"
              placeholder="Sharma"
              className="w-full bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder:text-muted-foreground/50 hover:bg-[var(--surface-overlay-hover)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-foreground ml-1">Work Email</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <input
              type="email"
              placeholder="ravi@institute.edu"
              className="w-full bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder:text-muted-foreground/50 hover:bg-[var(--surface-overlay-hover)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-foreground ml-1">Institution Name</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Building2 className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <input
              type="text"
              placeholder="Modern Institute of Tech"
              className="w-full bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder:text-muted-foreground/50 hover:bg-[var(--surface-overlay-hover)]"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-foreground ml-1">Password</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder:text-muted-foreground/50 hover:bg-[var(--surface-overlay-hover)]"
            />
          </div>
        </div>
        
        <p className="text-[11px] text-muted-foreground mt-4 text-center">
          By continuing, you agree to our <a href="#" className="text-foreground hover:underline">Terms of Service</a> and <a href="#" className="text-foreground hover:underline">Privacy Policy</a>.
        </p>

        <button className="w-full relative group mt-4 bg-foreground text-background font-bold py-3 rounded-xl transition-all duration-300 hover:bg-foreground/90 active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]">
          Create Account
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-foreground font-semibold hover:text-cyan-400 transition-colors">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
