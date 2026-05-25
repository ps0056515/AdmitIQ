export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Tenant Admin' | 'Operations Manager' | 'Analyst';
  avatar?: string;
  tenantId: string;
}

export const mockUsers: Record<string, User> = {
  'admin@admitiq.ai': {
    id: 'usr_001',
    email: 'admin@admitiq.ai',
    name: 'Admin User',
    role: 'Tenant Admin',
    tenantId: 'tnt_001',
  },
  'ops@admitiq.ai': {
    id: 'usr_002',
    email: 'ops@admitiq.ai',
    name: 'Ops Manager',
    role: 'Operations Manager',
    tenantId: 'tnt_001',
  },
  'analyst@admitiq.ai': {
    id: 'usr_003',
    email: 'analyst@admitiq.ai',
    name: 'Data Analyst',
    role: 'Analyst',
    tenantId: 'tnt_001',
  },
};
