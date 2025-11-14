import React, { useState } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Rider',
      email: 'john@example.com',
      phone: '+1234567890',
      role: 'rider',
      isActive: true,
    },
  ]);

  const columns = [
    { key: 'name' as keyof User, label: 'Name' },
    { key: 'email' as keyof User, label: 'Email' },
    { key: 'role' as keyof User, label: 'Role' },
    { key: 'isActive' as keyof User, label: 'Status' },
  ];

  return (
    <Layout>
      <h1 style={{ marginBottom: '1rem', color: '#111827' }}>User Management</h1>
      <Table
        columns={columns}
        data={users}
        actions={(user) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={() => alert('Edit ' + user.id)}>Edit</Button>
            <Button variant="danger" onClick={() => alert('Disable ' + user.id)}>Disable</Button>
          </div>
        )}
      />
    </Layout>
  );
}
