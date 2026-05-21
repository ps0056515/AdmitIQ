import type { ReactNode } from 'react';

interface LayoutProps {
  title: string;
  nav: ReactNode;
  children: ReactNode;
}

export function Layout({ title, nav, children }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          background: '#0f172a',
          color: '#fff',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>AdmitIQ</div>
          <div style={{ fontWeight: 700 }}>{title}</div>
        </div>
        <nav style={{ display: 'flex', gap: '1rem' }}>{nav}</nav>
      </header>
      <main style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>{children}</main>
    </div>
  );
}
