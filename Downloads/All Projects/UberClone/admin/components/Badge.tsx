import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const variantStyles = {
  primary: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  success: { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
  warning: { bg: '#fed7aa', text: '#b45309', border: '#fdba74' },
  error: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  info: { bg: '#cffafe', text: '#0369a1', border: '#67e8f9' }
};

const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary' }) => {
  const style = variantStyles[variant];

  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'inline-block'
    }}>
      {label}
    </span>
  );
};

export default Badge;
