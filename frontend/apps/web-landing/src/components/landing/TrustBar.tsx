import { motion } from 'framer-motion';
import { Shield, Server, Lock, Clock, FileCheck, Headphones } from 'lucide-react';

const trustItems = [
  {
    icon: <Shield className="w-4 h-4" />,
    label: 'DPDP Compliant',
    sublabel: 'India Data Protection',
  },
  {
    icon: <FileCheck className="w-4 h-4" />,
    label: 'TRAI DLT',
    sublabel: 'Registered Sender',
  },
  {
    icon: <Lock className="w-4 h-4" />,
    label: 'AES-256',
    sublabel: 'End-to-End Encrypted',
  },
  {
    icon: <Server className="w-4 h-4" />,
    label: '99.9% Uptime',
    sublabel: 'Enterprise SLA',
  },
  {
    icon: <Clock className="w-4 h-4" />,
    label: 'Audit Logs',
    sublabel: 'Full Compliance Trail',
  },
  {
    icon: <Headphones className="w-4 h-4" />,
    label: '24/7 Support',
    sublabel: 'Dedicated CSM',
  },
];

export function TrustBar() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            Enterprise-Grade Security & Compliance
          </span>
        </motion.div>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-3">
          {trustItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex flex-col items-center text-center px-4 py-5 rounded-xl border border-transparent hover:border-white/[0.06] hover:bg-white/[0.02] transition-all duration-400"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-muted-foreground group-hover:text-cyan-400 group-hover:border-cyan-500/20 group-hover:bg-cyan-500/[0.06] transition-all duration-400">
                {item.icon}
              </div>
              <div className="text-sm font-semibold text-foreground mb-0.5">
                {item.label}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {item.sublabel}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Logos / Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8 text-muted-foreground"
        >
          <span className="text-[11px] font-medium uppercase tracking-wider opacity-50">
            Trusted by leading institutions across India
          </span>
        </motion.div>
      </div>
    </section>
  );
}
