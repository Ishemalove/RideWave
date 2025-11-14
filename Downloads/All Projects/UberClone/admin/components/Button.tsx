import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  primary: {
    bg: '#2563eb',
    bgHover: '#1d4ed8',
    text: '#fff',
    border: 'none'
  },
  secondary: {
    bg: '#e5e7eb',
    bgHover: '#d1d5db',
    text: '#374151',
    border: 'none'
  },
  danger: {
    bg: '#ef4444',
    bgHover: '#dc2626',
    text: '#fff',
    border: 'none'
  },
  success: {
    bg: '#10b981',
    bgHover: '#059669',
    text: '#fff',
    border: 'none'
  }
};

const sizeStyles = {
  sm: { padding: '0.375rem 0.75rem', fontSize: '0.75rem' },
  md: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' }
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button'
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizeStyle,
        backgroundColor: disabled ? '#d1d5db' : variantStyle.bg,
        color: variantStyle.text,
        border: variantStyle.border,
        borderRadius: '0.375rem',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s ease',
        opacity: disabled ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variantStyle.bgHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variantStyle.bg;
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;
