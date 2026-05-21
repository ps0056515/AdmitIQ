import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@admitiq/api-client';
import { StatCard, Card } from '@admitiq/ui';

export function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({ queryKey: ['kpis'], queryFn: dashboardApi.kpis });
  const { data: queue } = useQuery({ queryKey: ['queue'], queryFn: dashboardApi.queue });

  if (isLoading) return <div>Loading dashboard…</div>;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div>
        <h1 style={{ margin: 0 }}>Operations Dashboard</h1>
        <p style={{ color: '#64748b' }}>North-star: median speed-to-first-contact under 5 minutes</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <StatCard label="Inquiries" value={kpis?.inquiries ?? 0} />
        <StatCard label="Contact rate" value={`${kpis?.contactRate ?? 0}%`} />
        <StatCard label="Qualified" value={kpis?.qualified ?? 0} />
        <StatCard
          label="Speed to first contact"
          value={`${kpis?.speedToFirstContactMinutes ?? '—'} min`}
          hint="median"
        />
      </div>
      <Card title="Counsellor callback queue">
        {!queue?.length ? (
          <p style={{ margin: 0, color: '#64748b' }}>No pending callbacks</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Callback</th>
                <th>Counsellor</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.lead?.name}</td>
                  <td>{item.callbackScheduledAt ?? '—'}</td>
                  <td>
                    {item.counsellor?.firstName} {item.counsellor?.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
