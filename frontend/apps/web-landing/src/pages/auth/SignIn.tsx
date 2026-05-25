import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../lib/auth';

export function SignIn() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Sign in to AdmitIQ</h2>
        <p className="text-[14px] text-muted-foreground">
          Enter your details below to access your orchestration dashboard.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <button className="w-full flex items-center justify-center gap-3 bg-[var(--surface-overlay)] border border-[var(--glass-border)] hover:bg-[var(--surface-overlay-hover)] hover:border-[var(--glass-border-hover)] text-foreground text-[14px] font-medium py-2.5 rounded-xl transition-all duration-300 group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        <button className="w-full flex items-center justify-center gap-3 bg-[var(--surface-overlay)] border border-[var(--glass-border)] hover:bg-[var(--surface-overlay-hover)] hover:border-[var(--glass-border-hover)] text-foreground text-[14px] font-medium py-2.5 rounded-xl transition-all duration-300 group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00a4ef"/>
          </svg>
          Continue with Microsoft
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center text-[12px]">
          <span className="bg-background px-3 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-foreground ml-1">Work Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@admitiq.ai"
            className="w-full bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder:text-muted-foreground/50 hover:bg-[var(--surface-overlay-hover)]"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[13px] font-medium text-foreground">Password</label>
            <a href="#" className="text-[12px] text-cyan-500 hover:text-cyan-400 transition-colors font-medium">Forgot password?</a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all placeholder:text-muted-foreground/50 hover:bg-[var(--surface-overlay-hover)]"
          />
        </div>

        <button 
          disabled={isLoading}
          className="w-full relative group mt-6 bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#030712] font-bold py-3 rounded-xl transition-all duration-300 hover:from-cyan-400 hover:to-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/signup" className="text-foreground font-semibold hover:text-cyan-400 transition-colors">
          Request access
        </Link>
      </p>
    </motion.div>
  );
}
