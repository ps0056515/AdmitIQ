import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Hindi', value: 18400, color: '#0ea5e9' },
  { name: 'English', value: 14200, color: '#3b82f6' },
  { name: 'Marathi', value: 5200, color: '#8b5cf6' },
  { name: 'Tamil', value: 4100, color: '#d946ef' },
  { name: 'Telugu', value: 3331, color: '#10b981' },
];

export function LanguageAnalytics() {
  return (
    <div className="bg-[var(--surface-overlay)] border border-[var(--glass-border)] rounded-2xl p-6 h-full flex flex-col hover:border-[var(--glass-border-hover)] transition-colors">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">Language Distribution</h3>
        <p className="text-sm text-muted-foreground mt-1">Primary languages spoken by leads</p>
      </div>
      
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--surface-overlay)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '12px',
                color: 'var(--foreground)'
              }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', color: 'var(--muted-foreground)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
