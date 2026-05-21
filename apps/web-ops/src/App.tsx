import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { authApi, internalApi, setAccessToken } from '@admitiq/api-client';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Layout } from '@admitiq/ui';

function LoginPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('platform@admitiq.in');
  const [password, setPassword] = useState('password123');

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await authApi.login(email, password);
    setAccessToken(res.accessToken);
    setToken(res.accessToken);
  }

  if (token) return <Navigate to="/tenants" replace />;

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card title="Internal Ops Login">
        <form onSubmit={login} style={{ display: 'grid', gap: 8 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  );
}

function TenantsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['tenants'], queryFn: internalApi.tenants });
  if (isLoading) return <div>Loading…</div>;
  return (
    <Card title="Tenant directory">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Plan</th>
            <th>Leads</th>
          </tr>
        </thead>
        <tbody>
          {(data as any[])?.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.slug}</td>
              <td>{t.status}</td>
              <td>{t.planTier}</td>
              <td>{t._count?.leads ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
          <Layout title="Internal Operations" nav={<Link to="/tenants">Tenants</Link>}>
            <Routes>
              <Route path="/" element={<Navigate to="/tenants" replace />} />
              <Route path="/tenants" element={<TenantsPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}
