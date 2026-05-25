import { useQuery } from '@tanstack/react-query';
import { campaignsApi } from '@admitiq/api-client';
import { Card } from '@admitiq/ui';

export function CampaignsPage() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignsApi.list,
  });

  if (isLoading) return <div>Loading campaigns…</div>;

  return (
    <Card title="Campaigns">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Active</th>
            <th>Caller ID</th>
          </tr>
        </thead>
        <tbody>
          {(campaigns as any[])?.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.isActive ? 'Yes' : 'No'}</td>
              <td>{c.callerId ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
