import { useQuery } from '@tanstack/react-query';
import { callsApi } from '@admitiq/api-client';
import { Card } from '@admitiq/ui';

export function CallsPage() {
  const { data: calls, isLoading } = useQuery({ queryKey: ['calls'], queryFn: callsApi.list });

  if (isLoading) return <div>Loading calls…</div>;

  return (
    <Card title="Call log">
      <table>
        <thead>
          <tr>
            <th>Lead</th>
            <th>Status</th>
            <th>Disposition</th>
            <th>Score</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          {(calls as any[])?.map((call) => (
            <tr key={call.id}>
              <td>{call.lead?.name}</td>
              <td>{call.status}</td>
              <td>{call.disposition ?? '—'}</td>
              <td>{call.leadScore ?? '—'}</td>
              <td>{call.languageDetected ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
