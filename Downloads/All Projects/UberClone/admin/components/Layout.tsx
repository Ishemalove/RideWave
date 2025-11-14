import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const isActive = (href: string) => {
    return router.pathname === href ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
            🚗 RideWave Admin
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Admin Panel v1.0
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
          <Link href="/">
            <a style={{
              padding: '1rem 0',
              borderBottom: isActive('/') === 'border-b-2 border-blue-600 text-blue-600' ? '2px solid #2563eb' : 'none',
              color: isActive('/').includes('blue') ? '#2563eb' : '#6b7280',
              textDecoration: 'none',
              fontWeight: isActive('/').includes('blue') ? '600' : '500',
              transition: 'all 0.3s ease'
            }}>
              Dashboard
            </a>
          </Link>
          <Link href="/users">
            <a style={{
              padding: '1rem 0',
              borderBottom: isActive('/users') === 'border-b-2 border-blue-600 text-blue-600' ? '2px solid #2563eb' : 'none',
              color: isActive('/users').includes('blue') ? '#2563eb' : '#6b7280',
              textDecoration: 'none',
              fontWeight: isActive('/users').includes('blue') ? '600' : '500',
              transition: 'all 0.3s ease'
            }}>
              Users
            </a>
          </Link>
          <Link href="/trips">
            <a style={{
              padding: '1rem 0',
              borderBottom: isActive('/trips') === 'border-b-2 border-blue-600 text-blue-600' ? '2px solid #2563eb' : 'none',
              color: isActive('/trips').includes('blue') ? '#2563eb' : '#6b7280',
              textDecoration: 'none',
              fontWeight: isActive('/trips').includes('blue') ? '600' : '500',
              transition: 'all 0.3s ease'
            }}>
              Trips
            </a>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '2rem',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p>&copy; 2024 RideWave. All rights reserved. Built with Next.js & React</p>
      </footer>
    </div>
  );
};

export default Layout;
