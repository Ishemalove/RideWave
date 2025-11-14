import React, { useState } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';

type Trip = {
  id: string;
  riderId: string;
  driverId: string;
  status: string;
  fare: number;
  createdAt: string;
};

export default function AdminTripsPage() {
  const [trips] = useState<Trip[]>([
    {
      id: 'trip-1',
      riderId: 'rider-1',
      driverId: 'driver-1',
      status: 'completed',
      fare: 25.5,
      createdAt: '2025-11-14T10:00:00Z',
    },
  ]);

  const columns = [
    { key: 'id' as keyof Trip, label: 'Trip ID' },
    { key: 'riderId' as keyof Trip, label: 'Rider' },
    { key: 'driverId' as keyof Trip, label: 'Driver' },
    { key: 'status' as keyof Trip, label: 'Status' },
    { key: 'fare' as keyof Trip, label: 'Fare' },
    { key: 'createdAt' as keyof Trip, label: 'Created' },
  ];

  return (
    <Layout>
      <h1 style={{ marginBottom: '1rem', color: '#111827' }}>Trip Logs</h1>
      <Table
        columns={columns}
        data={trips}
        actions={(trip) => <div style={{ color: '#6b7280' }}>—</div>}
      />
    </Layout>
  );
}
