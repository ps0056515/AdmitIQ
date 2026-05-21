import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
      }}
    >
      {title ? (
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#0f172a' }}>{title}</h3>
      ) : null}
      {children}
    </div>
  );
}
