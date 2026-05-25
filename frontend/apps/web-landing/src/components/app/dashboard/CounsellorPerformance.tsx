import { motion } from 'framer-motion';

const counsellors = [
  { name: 'Priya Sharma', status: 'Available', calls: 42, conversion: '32%', trend: '+4%' },
  { name: 'Rahul Verma', status: 'On Call', calls: 38, conversion: '28%', trend: '+1%' },
  { name: 'Neha Gupta', status: 'Away', calls: 24, conversion: '25%', trend: '-2%' },
  { name: 'Amit Kumar', status: 'Available', calls: 31, conversion: '29%', trend: '+2%' },
];

export function CounsellorPerformance() {
  return (
    <div className="bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-2xl p-6 flex flex-col hover:border-[var(--glass-border-hover)] transition-colors">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground tracking-tight">Counsellor Routing</h3>
          <p className="text-sm text-muted-foreground mt-1">Live transfer metrics</p>
        </div>
        <button className="text-[13px] font-medium text-cyan-400 hover:text-cyan-300">View All</button>
      </div>
      
      <div className="space-y-3">
        {counsellors.map((c, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3.5 rounded-xl bg-background/50 border border-[var(--glass-border)] hover:bg-[var(--surface-overlay-hover)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold text-sm border border-cyan-500/20">
                  {c.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
                  c.status === 'Available' ? 'bg-emerald-500' :
                  c.status === 'On Call' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground leading-tight">{c.name}</p>
                <p className="text-[12px] text-muted-foreground">{c.status}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Calls</p>
                <p className="text-[14px] font-medium text-foreground">{c.calls}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Conv.</p>
                <p className="text-[14px] font-medium text-foreground flex items-center justify-end gap-1">
                  {c.conversion}
                  <span className={`text-[10px] font-bold ${c.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {c.trend}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
