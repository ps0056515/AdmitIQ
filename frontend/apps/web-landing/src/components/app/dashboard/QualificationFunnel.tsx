import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Inquiries', value: 45231, color: '#0ea5e9' }, // cyan-500
  { name: 'AI Contacted', value: 39045, color: '#3b82f6' }, // blue-500
  { name: 'Qualified', value: 14201, color: '#8b5cf6' }, // violet-500
  { name: 'Transferred', value: 8432, color: '#d946ef' }, // fuchsia-500
  { name: 'Enrolled', value: 2150, color: '#10b981' }, // emerald-500
];

export function QualificationFunnel() {
  return (
    <div className="bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-2xl p-6 h-full flex flex-col hover:border-[var(--glass-border-hover)] transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">AI Qualification Funnel</h3>
        <p className="text-sm text-muted-foreground mt-1">End-to-end conversion metrics (30d)</p>
      </div>
      
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--glass-border)" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 13 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: 'var(--surface-overlay-hover)' }}
              contentStyle={{ 
                backgroundColor: 'var(--surface-overlay)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '12px',
                color: 'var(--foreground)'
              }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
