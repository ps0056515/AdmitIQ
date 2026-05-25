import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../lib/auth';
import { useUIStore } from '../../lib/ui-store';
import { AppShell } from '@admitiq/ui';
import { AppSidebar } from '../../components/app/AppSidebar';
import { AppTopbar } from '../../components/app/AppTopbar';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell 
      sidebar={<AppSidebar />}
      header={<AppTopbar />}
      isSidebarCollapsed={isSidebarCollapsed}
    >
      <Outlet />
    </AppShell>
  );
}
