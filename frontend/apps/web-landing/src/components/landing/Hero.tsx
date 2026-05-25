import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Animated Waveform Bars ─── */
function AIWaveform({ barCount = 40, className = '' }: { barCount?: number; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-[3px] h-16 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => {
        const delay = i * 0.06;
        const baseHeight = Math.sin((i / barCount) * Math.PI) * 0.7 + 0.3;
        return (
          <motion.div
            key={i}
            className="w-[2.5px] rounded-full bg-gradient-to-t from-cyan-500/60 to-cyan-300"
            initial={{ height: '15%' }}
            animate={{
              height: [`${baseHeight * 20}%`, `${baseHeight * 100}%`, `${baseHeight * 25}%`],
            }}
            transition={{
              duration: 1.2 + Math.random() * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Streaming Transcript Line ─── */
const transcriptLines = [
  { speaker: 'AI', text: 'Hello! This is AdmitIQ calling from Delhi Technical University.', lang: 'en' },
  { speaker: 'Student', text: 'Haan, maine form bhara tha B.Tech ke liye...', lang: 'hi' },
  { speaker: 'AI', text: 'Great! Aapne Computer Science mein interest dikhaya hai. Kya aapke paas JEE Mains score hai?', lang: 'hinglish' },
  { speaker: 'Student', text: 'Yes, mera score 89 percentile hai.', lang: 'hinglish' },
  { speaker: 'AI', text: 'Excellent! You qualify for merit-based admission. Let me connect you with a counsellor.', lang: 'en' },
];

function StreamingTranscript() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleLines >= transcriptLines.length) {
      const resetTimer = setTimeout(() => {
        setVisibleLines(0);
        setCurrentChar(0);
      }, 3000);
      return () => clearTimeout(resetTimer);
    }

    const currentLine = transcriptLines[visibleLines];
    if (currentChar < currentLine.text.length) {
      const charTimer = setTimeout(() => {
        setCurrentChar((prev) => prev + 1);
      }, 25 + Math.random() * 15);
      return () => clearTimeout(charTimer);
    } else {
      const lineTimer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
        setCurrentChar(0);
      }, 800);
      return () => clearTimeout(lineTimer);
    }
  }, [visibleLines, currentChar]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines, currentChar]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-3 overflow-hidden max-h-[200px] no-scrollbar"
    >
      {transcriptLines.slice(0, visibleLines + 1).map((line, idx) => {
        const isCurrentLine = idx === visibleLines;
        const displayText = isCurrentLine
          ? line.text.slice(0, currentChar)
          : line.text;
        const isAI = line.speaker === 'AI';

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
          >
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isAI
                  ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30'
                  : 'bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30'
              }`}
            >
              {isAI ? 'AI' : 'S'}
            </div>
            <div
              className={`max-w-[280px] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                isAI
                  ? 'bg-white/[0.04] text-slate-300 rounded-tl-md'
                  : 'bg-violet-500/[0.08] text-slate-300 rounded-tr-md'
              }`}
            >
              {displayText}
              {isCurrentLine && currentChar < line.text.length && (
                <span className="inline-block w-[2px] h-[14px] bg-cyan-400 ml-0.5 animate-typing-cursor" />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Floating Metric Card ─── */
function FloatingMetric({
  label,
  value,
  delay = 0,
  className = '',
  color = 'cyan',
}: {
  label: string;
  value: string;
  delay?: number;
  className?: string;
  color?: 'cyan' | 'violet' | 'emerald' | 'amber';
}) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card rounded-xl px-4 py-3 ${className}`}
    >
      <div className={`text-2xl font-bold bg-gradient-to-b ${colorMap[color]} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

/* ─── Orchestration Node ─── */
function OrchestrationNode({
  label,
  icon,
  status,
  delay = 0,
}: {
  label: string;
  icon: React.ReactNode;
  status: 'active' | 'pending' | 'complete';
  delay?: number;
}) {
  const statusStyles = {
    active: 'border-cyan-500/40 bg-cyan-500/[0.06] shadow-[0_0_20px_rgba(34,211,238,0.1)]',
    pending: 'border-white/[0.06] bg-white/[0.02]',
    complete: 'border-emerald-500/30 bg-emerald-500/[0.04]',
  };

  const dotStyles = {
    active: 'bg-cyan-400 glow-dot-cyan',
    pending: 'bg-slate-600',
    complete: 'bg-emerald-400 glow-dot-emerald',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border ${statusStyles[status]} transition-all duration-500`}
    >
      <div className="text-slate-400">{icon}</div>
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${dotStyles[status]}`} />
    </motion.div>
  );
}

/* ─── Connector Line ─── */
function ConnectorLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-[2px] h-8 mx-auto bg-gradient-to-b from-cyan-500/40 to-transparent origin-top"
    />
  );
}

/* ─── Main Hero Section ─── */
export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* ─── Background Layers ─── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        {/* Primary radial glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[900px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08)_0%,transparent_60%)]" />
        {/* Secondary violet glow */}
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,transparent_60%)]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        {/* Spotlight sweep */}
        <div className="absolute top-0 left-0 w-[200px] h-full bg-gradient-to-r from-transparent via-cyan-500/[0.03] to-transparent animate-spotlight" />
      </motion.div>

      {/* ─── Hero Content ─── */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 lg:pt-44 lg:pb-32"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* ─── Left Column: Copy + CTA ─── */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 self-start px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
                AI Voice Orchestration Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6"
            >
              Every admission inquiry{' '}
              <br className="hidden sm:block" />
              answered{' '}
              <span className="text-gradient-cyan">within minutes.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg"
            >
              AdmitIQ's AI voice agent calls new CRM leads within minutes,
              qualifies them in Hindi, English, or Hinglish, and routes
              hot prospects directly to your counsellors — with full context.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/signup"
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-[15px] overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative text-[#030712] font-bold">Request a Pilot</span>
                <ArrowRight className="relative w-4 h-4 text-[#030712] group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <a
                href="#demo"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-[15px] glass-card glass-card-hover text-foreground"
              >
                <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                  <Play className="w-3.5 h-3.5 text-cyan-400 ml-0.5" />
                </div>
                Listen to a Call
              </a>
            </motion.div>

            {/* Trust Indicators (inline) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-12 flex items-center gap-6 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-dot-emerald" />
                <span>DPDP Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-dot-emerald" />
                <span>TRAI DLT Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-dot-emerald" />
                <span>99.9% Uptime</span>
              </div>
            </motion.div>
          </div>

          {/* ─── Right Column: Live Product Visualization ─── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-7 relative"
          >
            {/* Main Dashboard Panel */}
            <div className="relative glass-card rounded-2xl overflow-hidden border-gradient">
              {/* Window Chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-white/[0.03] text-[11px] text-muted-foreground font-mono">
                    admitiq.ai/orchestrator
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-5">
                {/* Top Metrics Bar */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Avg Response', value: '2.4m', color: 'cyan' as const },
                    { label: 'Qualified Today', value: '147', color: 'emerald' as const },
                    { label: 'Active Calls', value: '12', color: 'violet' as const },
                    { label: 'Conversion', value: '34%', color: 'amber' as const },
                  ].map((metric, i) => (
                    <FloatingMetric
                      key={metric.label}
                      {...metric}
                      delay={0.5 + i * 0.1}
                    />
                  ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-5 gap-4">
                  {/* Left: AI Orchestration Pipeline */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-2 px-1">
                      Orchestration Pipeline
                    </div>
                    <OrchestrationNode
                      label="CRM Lead Received"
                      icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      }
                      status="complete"
                      delay={0.6}
                    />
                    <ConnectorLine delay={0.7} />
                    <OrchestrationNode
                      label="AI Call Initiated"
                      icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      }
                      status="complete"
                      delay={0.8}
                    />
                    <ConnectorLine delay={0.9} />
                    <OrchestrationNode
                      label="Qualification Active"
                      icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                      }
                      status="active"
                      delay={1.0}
                    />
                    <ConnectorLine delay={1.1} />
                    <OrchestrationNode
                      label="Counsellor Handoff"
                      icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      }
                      status="pending"
                      delay={1.2}
                    />
                  </div>

                  {/* Right: Live Transcript */}
                  <div className="col-span-3 flex flex-col">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                        Live Transcript
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] text-cyan-400 font-mono">LIVE</span>
                      </div>
                    </div>

                    {/* Waveform */}
                    <div className="mb-4 px-2">
                      <AIWaveform barCount={32} />
                    </div>

                    {/* Transcript */}
                    <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/[0.04] p-3.5">
                      <StreamingTranscript />
                    </div>

                    {/* Slot Extraction Preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                      className="mt-3 grid grid-cols-3 gap-2"
                    >
                      {[
                        { label: 'Course', value: 'B.Tech CS', color: 'text-cyan-400' },
                        { label: 'JEE Score', value: '89 %ile', color: 'text-violet-400' },
                        { label: 'Intent', value: 'High', color: 'text-emerald-400' },
                      ].map((slot) => (
                        <div
                          key={slot.label}
                          className="px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]"
                        >
                          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">
                            {slot.label}
                          </div>
                          <div className={`text-[13px] font-semibold ${slot.color} mt-0.5`}>
                            {slot.value}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-violet-500/[0.04] rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
