import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { authApi, leadsApi, setAccessToken } from '@admitiq/api-client';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Layout } from '@admitiq/ui';

function LoginPage() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('counsellor@demo-institute.in');
  const [password, setPassword] = useState('password123');

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await authApi.login(email, password);
    setAccessToken(res.accessToken);
    setReady(true);
  }

  if (ready) return <Navigate to="/inbox" replace />;

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <Card title="Counsellor App">
        <form onSubmit={login} style={{ display: 'grid', gap: 8 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  );
}

function InboxPage() {
  const { data, isLoading } = useQuery({ queryKey: ['my-leads'], queryFn: leadsApi.list });
  if (isLoading) return <div>Loading inbox…</div>;

  const mine = (data as any[])?.filter((l) => l.assignedTo);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {(mine ?? []).map((lead) => (
        <Card key={lead.id} title={`${lead.name} · ${lead.leadScore ?? lead.status}`}>
          <p style={{ margin: '0 0 8px' }}>{lead.courseInterest ?? 'General inquiry'}</p>
          <a href={`tel:${lead.phoneE164}`}>
            <Button>Call {lead.phoneE164}</Button>
          </a>
          <div style={{ marginTop: 8 }}>
            <Link to={`/leads/${lead.id}`}>View prep card →</Link>
          </div>
        </Card>
      ))}
    </div>
  );
}

function LeadDetailPage({ id }: { id: string }) {
  const { data, isLoading } = useQuery({ queryKey: ['lead', id], queryFn: () => leadsApi.get(id) });
  if (isLoading) return <div>Loading…</div>;
  const lead = data as any;
  const lastCall = lead?.callSessions?.[0];

  return (
    <Card title={lead?.name}>
      <p>Phone: {lead?.phoneE164}</p>
      <p>Course: {lead?.courseInterest}</p>
      {lastCall ? (
        <>
          <p>Disposition: {lastCall.disposition}</p>
          <p>Score: {lastCall.leadScore}</p>
        </>
      ) : null}
      <a href={`tel:${lead?.phoneE164}`}>
        <Button>Click to call</Button>
      </a>
    </Card>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <Layout title="Counsellor" nav={<Link to="/inbox">Inbox</Link>}>
            <Routes>
              <Route path="/" element={<Navigate to="/inbox" replace />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/leads/:id" element={<LeadDetailRoute />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

function LeadDetailRoute() {
  const id = window.location.pathname.split('/').pop() ?? '';
  return <LeadDetailPage id={id} />;
}
