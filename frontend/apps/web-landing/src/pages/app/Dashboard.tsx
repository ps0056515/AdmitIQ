import { PageHeader, MetricCard } from '@admitiq/ui';
import { Users, PhoneOutgoing, CheckCircle2, Clock } from 'lucide-react';
import { QualificationFunnel } from '../../components/app/dashboard/QualificationFunnel';
import { LanguageAnalytics } from '../../components/app/dashboard/LanguageAnalytics';
import { CounsellorPerformance } from '../../components/app/dashboard/CounsellorPerformance';

export function Dashboard() {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Operations Overview" 
        description="Real-time admissions metrics and AI orchestration health."
      />
      
      {/* Dashboard Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        
        {/* Row 1: Executive Metrics */}
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <MetricCard 
            title="Total Inquiries (30d)" 
            value="45,231" 
            icon={<Users className="w-4 h-4 text-cyan-400" />}
            trend={{ value: 12.4, label: 'vs last month', isPositive: true }}
          />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <MetricCard 
            title="Active AI Calls" 
            value="1,204" 
            icon={<PhoneOutgoing className="w-4 h-4 text-emerald-400" />}
            trend={{ value: 5.2, label: 'vs last hour', isPositive: true }}
            isLive
          />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <MetricCard 
            title="Contact Rate" 
            value="86.4%" 
            icon={<CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            trend={{ value: 2.1, label: 'vs last week', isPositive: true }}
          />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-3">
          <MetricCard 
            title="Avg Speed-to-Contact" 
            value="2m 14s" 
            icon={<Clock className="w-4 h-4 text-amber-400" />}
            trend={{ value: 14.5, label: 'faster than avg', isPositive: true }}
          />
        </div>
        
        {/* Row 2: Operational Intelligence */}
        <div className="col-span-1 md:col-span-6 lg:col-span-8 flex flex-col">
          <QualificationFunnel />
        </div>
        
        <div className="col-span-1 md:col-span-6 lg:col-span-4 flex flex-col">
          <CounsellorPerformance />
        </div>

        {/* Row 3: Human & AI Analytics */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 flex flex-col">
          <LanguageAnalytics />
        </div>
        
        {/* Placeholder for future activity feed */}
        <div className="col-span-1 md:col-span-6 lg:col-span-8 flex flex-col min-h-[300px]">
          <div className="flex-1 glass-card rounded-2xl p-6 flex flex-col items-center justify-center border border-[var(--glass-border)] border-dashed bg-[var(--surface-overlay)]/30">
            <div className="animate-pulse-ring h-3 w-3 bg-cyan-500 rounded-full mb-4 shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Activity Feed</p>
            <p className="text-xs text-muted-foreground mt-2">Connecting to orchestration stream...</p>
          </div>
        </div>

      </div>
    </div>
  );
}
