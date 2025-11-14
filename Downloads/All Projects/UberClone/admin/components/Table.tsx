import React, { useState } from 'react';

interface TableProps<T> {
  columns: { key: keyof T; label: string; width?: string }[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
}

const Table = <T extends { id: string | number }>({
  columns,
  data,
  actions
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer',
                    userSelect: 'none',
                    width: col.width || 'auto',
                    backgroundColor: sortKey === col.key ? '#f3f4f6' : undefined,
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {col.label}
                    {sortKey === col.key && (
                      <span style={{ fontSize: '0.75rem' }}>
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fff' : '#f9fafb'}
              >
                {columns.map(col => (
                  <td key={String(col.key)} style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151' }}>
                    {row[col.key] as React.ReactNode}
                  </td>
                ))}
                {actions && (
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
          No data available
        </div>
      )}
    </div>
  );
};

export default Table;
