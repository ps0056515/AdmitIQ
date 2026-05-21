import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CallsPage } from './pages/CallsPage';
import { Layout, Button } from '@admitiq/ui';

function Protected({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  return (
    <Layout
      title="Admin Console"
      nav={
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/leads">Leads</Link>
          <Link to="/campaigns">Campaigns</Link>
          <Link to="/calls">Calls</Link>
          <span style={{ opacity: 0.8 }}>{user?.email}</span>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </>
      }
    >
      {children}
    </Layout>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <Protected>
            <Shell>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/calls" element={<CallsPage />} />
              </Routes>
            </Shell>
          </Protected>
        }
      />
    </Routes>
  );
}
