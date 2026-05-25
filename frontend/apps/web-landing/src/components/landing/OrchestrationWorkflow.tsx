import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Database,
  Phone,
  BrainCircuit,
  BarChart3,
  UserCheck,
} from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: <Database className="w-5 h-5" />,
    title: 'Lead Enters CRM',
    description: 'Student submits an inquiry form. The lead is created in LeadSquared, Meritto, or Salesforce.',
    detail: 'Webhook fires instantly',
    color: 'violet' as const,
    status: 'New lead detected',
  },
  {
    id: 2,
    icon: <Phone className="w-5 h-5" />,
    title: 'AI Calls Within Minutes',
    description: 'AdmitIQ\'s orchestrator picks up the lead and initiates an outbound voice call via TRAI-compliant DLT.',
    detail: 'Avg 2.4 min response',
    color: 'cyan' as const,
    status: 'Call connecting...',
  },
  {
    id: 3,
    icon: <BrainCircuit className="w-5 h-5" />,
    title: 'AI Qualifies in Real-Time',
    description: 'Natural multilingual conversation extracts course interest, eligibility, budget, and timeline. Transcript streams live.',
    detail: 'Hindi • English • Hinglish',
    color: 'cyan' as const,
    status: 'Conversation active',
  },
  {
    id: 4,
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Lead Gets Scored',
    description: 'AI assigns a qualification score based on extracted slots, intent signals, and conversation engagement.',
    detail: 'Structured data extracted',
    color: 'emerald' as const,
    status: 'Score: 87/100',
  },
  {
    id: 5,
    icon: <UserCheck className="w-5 h-5" />,
    title: 'Counsellor Receives Hot Lead',
    description: 'Enriched lead — with full transcript, extracted data, and qualification score — is pushed to the assigned counsellor.',
    detail: 'CRM auto-updated',
    color: 'emerald' as const,
    status: 'Handoff complete',
  },
];

const colorStyles = {
  violet: {
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    iconColor: 'text-violet-400',
    line: 'from-violet-500/40',
    dot: 'bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]',
    badge: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    ring: 'ring-violet-500/20',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    iconColor: 'text-cyan-400',
    line: 'from-cyan-500/40',
    dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
    badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    ring: 'ring-cyan-500/20',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
    line: 'from-emerald-500/40',
    dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]',
    badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
};

function WorkflowStep({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const c = colorStyles[step.color];

  return (
    <div ref={ref} className="relative flex gap-6 lg:gap-8">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Step number dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: index * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className={`w-12 h-12 rounded-2xl border ${c.iconBg} flex items-center justify-center ${c.iconColor} relative z-10`}>
            {step.icon}
          </div>
          {/* Pulse ring on active step */}
          {index === 2 && (
            <div className="absolute inset-0 rounded-2xl border border-cyan-500/30 animate-pulse-ring" />
          )}
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`w-[2px] flex-1 min-h-[60px] bg-gradient-to-b ${c.line} to-transparent origin-top`}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.15 + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`flex-1 pb-12 ${isLast ? 'pb-0' : ''}`}
      >
        <div className="glass-card rounded-2xl p-6 group hover:bg-white/[0.04] transition-all duration-400">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Step {step.id}
              </span>
              <div className={`px-2.5 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${c.badge}`}>
                {step.status}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">{step.description}</p>

          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            <span className="font-medium">{step.detail}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function OrchestrationWorkflow() {
  return (
    <section id="how-it-works" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] mb-6"
          >
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">How It Works</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
          >
            From inquiry to qualified lead{' '}
            <span className="text-gradient-cyan">in under 10 minutes.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            AdmitIQ orchestrates the entire first-contact workflow — from CRM event detection
            to AI-driven qualification to counsellor handoff — automatically.
          </motion.p>
        </div>

        {/* Workflow Timeline */}
        <div className="max-w-2xl mx-auto lg:ml-[20%]">
          {steps.map((step, index) => (
            <WorkflowStep
              key={step.id}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-3 glass-card rounded-full px-6 py-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="text-sm font-medium text-muted-foreground">
              Full cycle completes in <span className="text-foreground font-semibold">under 10 minutes</span> — 
              no human intervention required
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
