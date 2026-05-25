import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
} from 'lucide-react';

/* ─── Footer Link Column ─── */
function FooterColumn({
  title,
  links,
  delay,
}: {
  title: string;
  links: { label: string; href: string; badge?: string }[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3 className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2 group"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {link.badge}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

const productLinks = [
  { label: 'AI Voice Orchestration', href: '#' },
  { label: 'Workflow Engine', href: '#how-it-works' },
  { label: 'Live AI Demo', href: '#demo' },
  { label: 'CRM Integrations', href: '#' },
  { label: 'Analytics Dashboard', href: '#product' },
  { label: 'Multilingual AI', href: '#' },
];

const platformLinks = [
  { label: 'API Reference', href: '#', badge: 'Soon' },
  { label: 'Architecture', href: '#' },
  { label: 'Webhooks', href: '#' },
  { label: 'System Status', href: '#' },
  { label: 'Changelog', href: '#', badge: 'New' },
  { label: 'Roadmap', href: '#' },
];

const complianceLinks = [
  { label: 'DPDP Act', href: '#' },
  { label: 'TRAI DLT', href: '#' },
  { label: 'Data Residency', href: '#' },
  { label: 'Security', href: '#' },
  { label: 'Audit Logs', href: '#' },
  { label: 'SOC 2', href: '#', badge: 'In Progress' },
];

const companyLinks = [
  { label: 'About', href: '#' },
  { label: 'Careers', href: '#', badge: 'Hiring' },
  { label: 'Contact', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--glass-border-hover)] to-transparent opacity-50" />

      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.02)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Main Footer Content ─── */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4"
            >
              {/* Logo */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)] group transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:scale-105">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" fill="white" />
                    <circle cx="12" cy="12" r="2" fill="white" />
                  </svg>
                </div>
                <span className="text-base font-bold text-foreground tracking-tight">AdmitIQ</span>
              </div>

              <p className="text-[13px] text-muted-foreground leading-relaxed mb-6 max-w-xs">
                Real-time AI voice orchestration infrastructure for modern education institutions.
                Every inquiry answered. Every lead qualified. Every counsellor empowered.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {[
                  {
                    label: 'LinkedIn',
                    href: '#',
                    svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                  },
                  {
                    label: 'GitHub',
                    href: '#',
                    svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
                  },
                  {
                    label: 'X / Twitter',
                    href: '#',
                    svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-lg bg-[var(--surface-overlay)] border border-[var(--glass-border)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[var(--glass-border-hover)] hover:bg-[var(--surface-overlay-hover)] transition-all duration-300"
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Nav Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <FooterColumn title="Product" links={productLinks} delay={0.1} />
              <FooterColumn title="Platform" links={platformLinks} delay={0.15} />
              <FooterColumn title="Compliance" links={complianceLinks} delay={0.2} />
              <FooterColumn title="Company" links={companyLinks} delay={0.25} />
            </div>
          </div>
        </div>

        {/* ─── CTA Strip ─── */}
        <div className="border-t border-[var(--glass-border)] py-6 relative group">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--glass-border-hover)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-[15px] font-semibold text-foreground mb-1 tracking-tight">
                Ready to eliminate admission response gaps?
              </h3>
              <p className="text-[12px] text-muted-foreground">
                Deploy AdmitIQ in under a week. No code changes required.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 z-10">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#030712] font-semibold text-[13px] hover:from-cyan-400 hover:to-cyan-300 transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                Request a Pilot
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/"
                className="px-4 py-2 rounded-lg bg-[var(--surface-overlay)] border border-[var(--glass-border)] text-[13px] font-medium text-foreground hover:bg-[var(--surface-overlay-hover)] transition-all duration-300"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ─── Infrastructure Strip ─── */}
        <div className="border-t border-[var(--glass-border)] py-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Left: Copyright */}
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span>© {new Date().getFullYear()} AdmitIQ Technologies.</span>
              <span className="hidden sm:inline text-muted-foreground/30">|</span>
              <span className="hidden sm:inline">Made in India</span>
            </div>

            {/* Right: Live Infra Indicators (Subtle & Elegant) */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-x-3 gap-y-2 text-[11px] text-muted-foreground font-mono">
              <div className="flex items-center gap-1.5 group">
                <div className="relative flex items-center justify-center w-2 h-2">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 group-hover:animate-ping" />
                  <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                </div>
                <span className="text-foreground/80 group-hover:text-foreground transition-colors">All systems operational</span>
              </div>
              <span className="text-muted-foreground/20">•</span>
              <span className="text-foreground/80 hover:text-foreground transition-colors cursor-default">Mumbai region active</span>
              <span className="text-muted-foreground/20">•</span>
              <span className="text-foreground/80 hover:text-foreground transition-colors cursor-default">18ms avg latency</span>
              <span className="text-muted-foreground/20">•</span>
              <span className="text-foreground/80 hover:text-foreground transition-colors cursor-default">142 live AI conversations</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
