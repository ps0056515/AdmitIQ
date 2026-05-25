import { motion } from 'framer-motion';
import {
  Zap,
  Globe,
  Database,
  BrainCircuit,
  UserCheck,
  Shield,
  FileText,
  BarChart3,
  Workflow,
} from 'lucide-react';

type BentoFeature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  size: 'large' | 'medium' | 'small';
  color: 'cyan' | 'violet' | 'emerald' | 'amber';
  visual?: React.ReactNode;
};

const colorMap = {
  cyan: {
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    iconColor: 'text-cyan-400',
    hoverBorder: 'hover:border-cyan-500/20',
    glow: 'group-hover:shadow-[0_0_60px_rgba(34,211,238,0.05)]',
  },
  violet: {
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    iconColor: 'text-violet-400',
    hoverBorder: 'hover:border-violet-500/20',
    glow: 'group-hover:shadow-[0_0_60px_rgba(139,92,246,0.05)]',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/20',
    glow: 'group-hover:shadow-[0_0_60px_rgba(52,211,153,0.05)]',
  },
  amber: {
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-400',
    hoverBorder: 'hover:border-amber-500/20',
    glow: 'group-hover:shadow-[0_0_60px_rgba(251,191,36,0.05)]',
  },
};

/* ─── Mini SLA Visualization ─── */
function SLAVisual() {
  return (
    <div className="flex items-end gap-1 h-10 mt-4">
      {[95, 60, 100, 45, 85, 70, 90, 55, 98, 80, 95, 65].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 + 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`w-2 rounded-full ${h > 80 ? 'bg-cyan-400/60' : 'bg-cyan-400/25'}`}
        />
      ))}
    </div>
  );
}

/* ─── Mini CRM Flow ─── */
function CRMFlow() {
  const nodes = ['LeadSq', 'Meritto', 'SFDC'];
  return (
    <div className="flex items-center gap-2 mt-4">
      {nodes.map((node, i) => (
        <div key={node} className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 + 0.3, duration: 0.4 }}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-muted-foreground"
          >
            {node}
          </motion.div>
          {i < nodes.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 + 0.4, duration: 0.3 }}
              className="w-4 h-[1px] bg-cyan-500/30 origin-left"
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Qualification Slots Visual ─── */
function QualificationVisual() {
  const slots = [
    { key: 'Course', value: 'B.Tech', filled: true },
    { key: 'Score', value: '89%', filled: true },
    { key: 'Budget', value: '—', filled: false },
  ];
  return (
    <div className="flex flex-col gap-1.5 mt-4">
      {slots.map((slot, i) => (
        <motion.div
          key={slot.key}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${slot.filled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
          <span className="text-[10px] text-muted-foreground w-12">{slot.key}</span>
          <span className={`text-[10px] font-mono ${slot.filled ? 'text-foreground' : 'text-muted-foreground/40'}`}>
            {slot.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const features: BentoFeature[] = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: '5-Minute SLA',
    description: 'Every new CRM lead receives an AI call within minutes. No manual dialling, no queue delays, no leads left behind.',
    size: 'large',
    color: 'cyan',
    visual: <SLAVisual />,
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Multilingual AI',
    description: 'Native Hindi, English, and seamless Hinglish code-switching. Students speak naturally.',
    size: 'medium',
    color: 'violet',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'CRM Integrations',
    description: 'Pre-built connectors for LeadSquared, Meritto, Salesforce, and custom webhooks.',
    size: 'medium',
    color: 'cyan',
    visual: <CRMFlow />,
  },
  {
    icon: <BrainCircuit className="w-5 h-5" />,
    title: 'AI Qualification Engine',
    description: 'Extracts course interest, eligibility, budget, and timeline through natural conversation.',
    size: 'large',
    color: 'emerald',
    visual: <QualificationVisual />,
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    title: 'Smart Counsellor Routing',
    description: 'Hot leads are routed to the right counsellor with full transcript context and qualification data.',
    size: 'small',
    color: 'violet',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'DPDP & TRAI Compliant',
    description: 'Built for Indian regulatory compliance. DLT registered, consent-managed, audit-logged.',
    size: 'small',
    color: 'amber',
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Full Transcripts',
    description: 'Every call is transcribed with speaker diarization and pushed to your CRM automatically.',
    size: 'small',
    color: 'cyan',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Operational Analytics',
    description: 'Real-time dashboards for speed-to-contact, qualification rates, and counsellor performance.',
    size: 'small',
    color: 'emerald',
  },
  {
    icon: <Workflow className="w-5 h-5" />,
    title: 'Real-Time Orchestration',
    description: 'Event-driven architecture processes leads, triggers calls, and syncs data without polling.',
    size: 'medium',
    color: 'violet',
  },
];

function BentoCard({ feature, index }: { feature: BentoFeature; index: number }) {
  const c = colorMap[feature.color];
  const isLarge = feature.size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative glass-card rounded-2xl p-6 ${c.hoverBorder} ${c.glow} hover:bg-white/[0.03] transition-all duration-500 ${
        isLarge ? 'lg:col-span-2' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-xl border ${c.iconBg} flex items-center justify-center ${c.iconColor} mb-4 group-hover:scale-110 transition-transform duration-400`}>
        {feature.icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{feature.description}</p>
      {feature.visual && feature.visual}
    </motion.div>
  );
}

export function BentoFeatureGrid() {
  return (
    <section className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-0 bg-dots opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] mb-6"
          >
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Platform Capabilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
          >
            Built for{' '}
            <span className="text-gradient-cyan">enterprise admissions</span>
            {' '}at scale.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Every capability is designed for Indian education — from TRAI compliance to
            Hinglish code-switching to LeadSquared integration.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <BentoCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
