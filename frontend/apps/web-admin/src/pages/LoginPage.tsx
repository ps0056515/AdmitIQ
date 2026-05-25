import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@admitiq/api-client';
import { useAuthStore } from '../store/auth';
import { Button, Card } from '@admitiq/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('admin@demo-institute.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const result = await authApi.login(email, password);
      setAuth(result.accessToken, result.user);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f1f5f9' }}>
      <Card title="AdmitIQ Admin Login">
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem', minWidth: 320 }}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: 8 }}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: 8 }}
            />
          </label>
          {error ? <div style={{ color: '#dc2626' }}>{error}</div> : null}
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  );
}
