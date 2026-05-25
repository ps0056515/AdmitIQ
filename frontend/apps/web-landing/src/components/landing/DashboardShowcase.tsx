import { motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle2,
  ArrowUpRight,
  Activity,
} from 'lucide-react';

/* ─── Mini Sparkline ─── */
function Sparkline({ data, color = 'cyan' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 32;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`)
    .join(' ');

  const colorMap: Record<string, string> = {
    cyan: '#22d3ee',
    emerald: '#34d399',
    violet: '#8b5cf6',
    amber: '#fbbf24',
  };

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={colorMap[color] || colorMap.cyan}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

/* ─── Metric Card ─── */
function DashMetric({
  label,
  value,
  change,
  changeDir,
  sparkData,
  color,
  delay,
}: {
  label: string;
  value: string;
  change: string;
  changeDir: 'up' | 'down';
  sparkData: number[];
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-xl p-4 hover:bg-white/[0.04] transition-all duration-400"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
          changeDir === 'up'
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          <ArrowUpRight className={`w-3 h-3 ${changeDir === 'down' ? 'rotate-90' : ''}`} />
          {change}
        </div>
      </div>
      <Sparkline data={sparkData} color={color} />
    </motion.div>
  );
}

/* ─── Call Activity Row ─── */
function CallActivityRow({
  name,
  course,
  score,
  status,
  time,
  delay,
}: {
  name: string;
  course: string;
  score: number;
  status: 'qualified' | 'in-call' | 'scheduled';
  time: string;
  delay: number;
}) {
  const statusStyles = {
    qualified: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Qualified' },
    'in-call': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', label: 'In Call' },
    scheduled: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Scheduled' },
  };
  const s = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0 group"
    >
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[11px] font-bold text-muted-foreground">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-foreground truncate">{name}</div>
        <div className="text-[11px] text-muted-foreground">{course}</div>
      </div>
      <div className="text-right hidden sm:block">
        <div className="text-[13px] font-semibold text-foreground">{score}/100</div>
        <div className="text-[10px] text-muted-foreground">Score</div>
      </div>
      <div className={`px-2 py-1 rounded-md ${s.bg} ${s.text} text-[10px] font-semibold uppercase tracking-wider`}>
        {s.label}
      </div>
      <div className="text-[11px] text-muted-foreground font-mono hidden sm:block">{time}</div>
    </motion.div>
  );
}

export function DashboardShowcase() {
  return (
    <section id="product" className="relative py-28 lg:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.06] mb-6"
          >
            <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Operations Dashboard</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5"
          >
            Complete visibility into your{' '}
            <span className="text-gradient-violet">admission operations.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Track speed-to-contact, qualification rates, counsellor performance, and funnel health
            — all in real-time from a single unified dashboard.
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-2xl overflow-hidden border-gradient"
        >
          {/* Dashboard Chrome */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[11px] text-muted-foreground font-mono px-3 py-1 rounded bg-white/[0.03]">
                admitiq.ai/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-mono">LIVE</span>
            </div>
          </div>

          <div className="p-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <DashMetric
                label="Speed to Contact"
                value="2.4 min"
                change="32%"
                changeDir="up"
                sparkData={[8, 6, 5, 4.5, 3.8, 3.2, 2.8, 2.4]}
                color="cyan"
                delay={0.1}
              />
              <DashMetric
                label="Qualification Rate"
                value="72.4%"
                change="18%"
                changeDir="up"
                sparkData={[45, 52, 58, 62, 65, 68, 70, 72.4]}
                color="emerald"
                delay={0.15}
              />
              <DashMetric
                label="Active Calls"
                value="12"
                change="6"
                changeDir="up"
                sparkData={[3, 5, 8, 6, 10, 8, 14, 12]}
                color="violet"
                delay={0.2}
              />
              <DashMetric
                label="Conversion Rate"
                value="34.2%"
                change="24%"
                changeDir="up"
                sparkData={[18, 20, 22, 25, 28, 30, 32, 34.2]}
                color="amber"
                delay={0.25}
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Left: Call Activity Feed */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                    Recent Call Activity
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">Today</span>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <CallActivityRow name="Priya Sharma" course="B.Tech CS — DTU" score={87} status="qualified" time="2 min ago" delay={0.3} />
                  <CallActivityRow name="Arjun Mehta" course="MBA Finance — IMS" score={92} status="qualified" time="5 min ago" delay={0.35} />
                  <CallActivityRow name="Anjali Gupta" course="B.Sc Chemistry — RU" score={0} status="in-call" time="Now" delay={0.4} />
                  <CallActivityRow name="Rahul Verma" course="B.Tech Mech — VIT" score={0} status="scheduled" time="In 3 min" delay={0.45} />
                  <CallActivityRow name="Deepika Patel" course="BBA — Christ" score={78} status="qualified" time="12 min ago" delay={0.5} />
                </div>
              </div>

              {/* Right: Quick Stats */}
              <div className="lg:col-span-2 space-y-4">
                {/* Funnel */}
                <div>
                  <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                    Today's Funnel
                  </div>
                  <div className="glass-card rounded-xl p-4 space-y-3">
                    {[
                      { label: 'Total Leads', value: 312, width: '100%', color: 'bg-slate-500/40' },
                      { label: 'Contacted', value: 298, width: '95%', color: 'bg-cyan-500/50' },
                      { label: 'Qualified', value: 147, width: '47%', color: 'bg-violet-500/50' },
                      { label: 'Counsellor Assigned', value: 89, width: '28%', color: 'bg-emerald-500/50' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-muted-foreground font-medium">{item.label}</span>
                          <span className="text-[12px] text-foreground font-semibold">{item.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: item.width }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full rounded-full ${item.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CRM Sync Status */}
                <div className="glass-card rounded-xl p-4">
                  <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                    CRM Sync Health
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { name: 'LeadSquared', status: 'synced', count: 298 },
                      { name: 'Webhooks', status: 'synced', count: 312 },
                      { name: 'Transcripts', status: 'synced', count: 147 },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
                        <span className="text-[12px] text-foreground font-medium flex-1">{item.name}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">{item.count}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
