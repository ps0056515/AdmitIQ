import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '@admitiq/api-client';
import { Card } from '@admitiq/ui';

export function LeadsPage() {
  const { data: leads, isLoading } = useQuery({ queryKey: ['leads'], queryFn: leadsApi.list });

  if (isLoading) return <div>Loading leads…</div>;

  return (
    <Card title="All leads">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {(leads as any[])?.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.phoneE164}</td>
              <td>{lead.courseInterest ?? '—'}</td>
              <td>{lead.status}</td>
              <td>{lead.source ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
