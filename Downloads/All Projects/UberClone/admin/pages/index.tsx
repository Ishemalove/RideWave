import React from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

export default function AdminHome() {
  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <StatCard title="Active Riders" value={1248} icon="👥" trend={5} color="blue" />
        <StatCard title="Active Drivers" value={842} icon="🚗" trend={2} color="green" />
        <StatCard title="Trips Today" value={358} icon="📍" trend={-3} color="orange" />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem', color: '#374151' }}>Overview</h2>
        <p style={{ color: '#6b7280' }}>Quick summary of platform activity and recent alerts.</p>
      </div>
    </Layout>
  );
}
