import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: '#1e40af',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: '#e2e8f0',
    color: '#0f172a',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: '#1e40af',
    border: '1px solid #cbd5e1',
  },
};

export function Button({ variant = 'primary', children, style, ...props }: ButtonProps) {
  return (
    <button
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: 600,
        cursor: 'pointer',
        ...styles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
