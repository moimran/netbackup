import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import { StatusChip } from '../components/StatusChip';
import {
  Button,
  Card,
  Typography,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Device, Column } from '../types';

const STAT_CARDS = [
  { title: 'Total Devices', value: '156', color: 'blue' },
  { title: 'Active Devices', value: '143', color: 'green' },
  { title: 'Pending Backups', value: '13', color: 'yellow' },
] as const;

const columns: Column<Device>[] = [
  { id: 'name', label: 'Device Name', minWidth: 170 },
  { id: 'ip', label: 'IP Address', minWidth: 130 },
  {
    id: 'type',
    label: 'Device Type',
    minWidth: 120,
    format: (value: string) => (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
        {value}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 120,
    format: (value: Device['status']) => <StatusChip status={value} />,
  },
  {
    id: 'lastBackup',
    label: 'Last Backup',
    minWidth: 170,
    format: (value: string) => (
      <span className="text-gray-600 dark:text-gray-300">{value}</span>
    ),
  },
  {
    id: 'nextBackup',
    label: 'Next Backup',
    minWidth: 170,
    format: (value: string) => (
      <span className="text-gray-600 dark:text-gray-300">{value}</span>
    ),
  },
];

const sampleData: Device[] = [
  {
    id: '1',
    name: 'Core Switch 01',
    ip: '192.168.1.1',
    type: 'Switch',
    status: 'active',
    lastBackup: '2024-01-12 15:30',
    nextBackup: '2024-01-13 15:30',
  },
  {
    id: '2',
    name: 'Edge Router 01',
    ip: '192.168.1.254',
    type: 'Router',
    status: 'warning',
    lastBackup: '2024-01-12 14:00',
    nextBackup: '2024-01-13 14:00',
  },
  {
    id: '3',
    name: 'Firewall 01',
    ip: '192.168.1.2',
    type: 'Firewall',
    status: 'error',
    lastBackup: '2024-01-12 13:45',
    nextBackup: '2024-01-13 13:45',
  },
];

const StatCard: React.FC<{
  title: string;
  value: string;
  color: string;
}> = React.memo(({ title, value, color }) => {
  const theme = useTheme();
  
  return (
    <Card
      elevation={0}
      className={`border p-4 rounded-xl transition-all duration-300 hover:shadow-md ${
        theme.palette.mode === 'dark'
          ? 'border-gray-700 hover:border-gray-600'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <Typography color="textSecondary" variant="subtitle2">
        {title}
      </Typography>
      <Typography variant="h4" className="font-semibold mt-1">
        {value}
      </Typography>
    </Card>
  );
});
StatCard.displayName = 'StatCard';

export const DevicesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleEdit = useCallback((row: Device) => {
    console.log('Edit device:', row);
  }, []);

  const handleDelete = useCallback((row: Device) => {
    console.log('Delete device:', row);
  }, []);

  const handleRowClick = useCallback((row: Device) => {
    console.log('Row clicked:', row);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" className="font-semibold mb-1">
            Network Devices
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage and monitor your network devices
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add Device
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {STAT_CARDS.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <CustomTable<Device>
        columns={columns}
        rows={sampleData}
        selectable
        actions
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />
    </div>
  );
};
