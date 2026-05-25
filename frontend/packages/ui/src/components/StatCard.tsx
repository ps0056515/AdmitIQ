interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
      }}
    >
      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{value}</div>
      {hint ? <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{hint}</div> : null}
    </div>
  );
}
