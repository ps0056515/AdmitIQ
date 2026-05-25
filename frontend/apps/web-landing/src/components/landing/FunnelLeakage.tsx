import { motion } from 'framer-motion';
import { Clock, UserX, TrendingDown, PhoneOff, AlertTriangle, ArrowDown } from 'lucide-react';

/* ─── Animated Counter ─── */
function AnimatedStat({ value, suffix = '', prefix = '' }: { value: string; suffix?: string; prefix?: string }) {
  return (
    <span className="tabular-nums">
      {prefix}{value}{suffix}
    </span>
  );
}

/* ─── Leak Node ─── */
function LeakNode({
  icon,
  stat,
  label,
  description,
  delay,
  color,
}: {
  icon: React.ReactNode;
  stat: string;
  label: string;
  description: string;
  delay: number;
  color: 'red' | 'amber' | 'orange';
}) {
  const colorMap = {
    red: {
      bg: 'bg-red-500/[0.06]',
      border: 'border-red-500/20',
      icon: 'text-red-400',
      stat: 'text-red-400',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.08)]',
    },
    amber: {
      bg: 'bg-amber-500/[0.06]',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      stat: 'text-amber-400',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.08)]',
    },
    orange: {
      bg: 'bg-orange-500/[0.06]',
      border: 'border-orange-500/20',
      icon: 'text-orange-400',
      stat: 'text-orange-400',
      glow: 'shadow-[0_0_30px_rgba(249,115,22,0.08)]',
    },
  };

  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl border ${c.border} ${c.bg} ${c.glow} p-6 group hover:scale-[1.02] transition-transform duration-400`}
    >
      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4 ${c.icon}`}>
        {icon}
      </div>
      <div className={`text-3xl font-bold ${c.stat} mb-1`}>
        <AnimatedStat value={stat} />
      </div>
      <div className="text-sm font-semibold text-foreground mb-1.5">{label}</div>
      <div className="text-[13px] text-muted-foreground leading-relaxed">{description}</div>
    </motion.div>
  );
}

/* ─── Solution Point ─── */
function SolutionPoint({
  label,
  value,
  description,
  delay,
}: {
  label: string;
  value: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.03] p-6 group hover:border-cyan-500/25 hover:bg-cyan-500/[0.05] transition-all duration-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.06)]"
    >
      <div className="text-3xl font-bold text-gradient-cyan mb-1">{value}</div>
      <div className="text-sm font-semibold text-foreground mb-1.5">{label}</div>
      <div className="text-[13px] text-muted-foreground leading-relaxed">{description}</div>
    </motion.div>
  );
}

export function FunnelLeakage() {


  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.03)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── THE PROBLEM ─── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/20 bg-red-500/[0.06] mb-6"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">The Problem</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
          >
            Your admission funnel is{' '}
            <span className="text-red-400">leaking revenue.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Most institutions lose 60-70% of qualified prospects before a counsellor ever speaks to them.
            Slow response, language gaps, and manual processes are silently killing your conversion.
          </motion.p>
        </div>

        {/* Problem Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <LeakNode
            icon={<Clock className="w-5 h-5" />}
            stat="47hrs"
            label="Average First Response"
            description="Most colleges take 2 days to call a new inquiry. By then, the student has enrolled elsewhere."
            delay={0.1}
            color="red"
          />
          <LeakNode
            icon={<PhoneOff className="w-5 h-5" />}
            stat="78%"
            label="Calls Go Unanswered"
            description="Counsellors handle 100+ leads daily. Most inquiries never receive a callback."
            delay={0.2}
            color="amber"
          />
          <LeakNode
            icon={<UserX className="w-5 h-5" />}
            stat="65%"
            label="Leads Lost to Language"
            description="Students drop off when the initial call isn't in their preferred language."
            delay={0.3}
            color="orange"
          />
          <LeakNode
            icon={<TrendingDown className="w-5 h-5" />}
            stat="₹2.3Cr"
            label="Revenue Lost per Season"
            description="A mid-size institution loses crores in tuition revenue from uncontacted qualified leads."
            delay={0.4}
            color="red"
          />
        </div>

        {/* ─── Transition Arrow ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-20"
        >
          <div className="w-px h-16 bg-gradient-to-b from-red-500/30 via-amber-500/20 to-cyan-500/30" />
          <div className="w-12 h-12 rounded-full border border-cyan-500/30 bg-cyan-500/[0.06] flex items-center justify-center my-3">
            <ArrowDown className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-cyan-500/30 to-transparent" />
        </motion.div>

        {/* ─── THE SOLUTION ─── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">With AdmitIQ</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
          >
            Every lead gets an{' '}
            <span className="text-gradient-cyan">intelligent first conversation.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            AdmitIQ eliminates the response gap. Every new CRM lead receives an AI-driven multilingual
            call within minutes — qualified, scored, and routed to a counsellor with full context.
          </motion.p>
        </div>

        {/* Solution Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SolutionPoint
            value="< 5 min"
            label="Speed to First Contact"
            description="AI calls are triggered within minutes of CRM lead creation. No human bottleneck."
            delay={0.1}
          />
          <SolutionPoint
            value="100%"
            label="Lead Coverage"
            description="Every single inquiry gets a call. No lead is ever left unanswered or forgotten."
            delay={0.2}
          />
          <SolutionPoint
            value="3 Languages"
            label="Multilingual Qualification"
            description="Hindi, English, and Hinglish code-switching. Students speak naturally, AI adapts."
            delay={0.3}
          />
          <SolutionPoint
            value="3.2×"
            label="Counsellor Productivity"
            description="Counsellors only receive pre-qualified, enriched leads with full transcript context."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
