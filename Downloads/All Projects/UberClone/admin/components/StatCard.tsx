import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: number;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const colorMap = {
  blue: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  green: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  orange: { bg: '#fffbeb', text: '#b45309', border: '#fcd34d' },
  red: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' }
};

const StatCard: React.FC<CardProps> = ({ title, value, icon, trend, color = 'blue' }) => {
  const colors = colorMap[color];
  
  return (
    <div style={{
      backgroundColor: '#fff',
      border: `1px solid #e5e7eb`,
      borderRadius: '0.5rem',
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    }}>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
          {title}
        </p>
        <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
          {value}
        </p>
        {trend !== undefined && (
          <p style={{ fontSize: '0.75rem', color: trend >= 0 ? '#10b981' : '#ef4444', marginTop: '0.5rem' }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      <div style={{
        fontSize: '2rem',
        backgroundColor: colors.bg,
        color: colors.text,
        width: '3rem',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.375rem',
        border: `1px solid ${colors.border}`
      }}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
