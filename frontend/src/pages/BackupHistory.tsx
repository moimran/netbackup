import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material'
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import React from 'react';
import { CustomTable } from '../components/CustomTable';
import TableHeader from '../components/TableHeader';
import {
  Card,
  useTheme,
  Box,
} from '@mui/material';

interface BackupRecord {
  id: number
  deviceName: string
  deviceIp: string
  timestamp: string
  status: string
  fileSize: string
}

const BackupHistory = () => {
  const [timeFilter, setTimeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data - will be replaced with API calls
  const backups: BackupRecord[] = [
    {
      id: 1,
      deviceName: 'Core Switch',
      deviceIp: '192.168.1.1',
      timestamp: '2025-01-12 20:30',
      status: 'Success',
      fileSize: '45 KB',
    },
    {
      id: 2,
      deviceName: 'Edge Router',
      deviceIp: '192.168.1.2',
      timestamp: '2025-01-12 20:00',
      status: 'Failed',
      fileSize: '0 KB',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'success'
      case 'failed':
        return 'error'
      case 'in progress':
        return 'warning'
      default:
        return 'default'
    }
  }

  const theme = useTheme();

  const columns = [
    { field: 'deviceName', headerName: 'Device Name' },
    { field: 'deviceIp', headerName: 'IP Address' },
    { field: 'timestamp', headerName: 'Timestamp' },
    { field: 'status', headerName: 'Status' },
    { field: 'fileSize', headerName: 'File Size' },
    { field: 'actions', headerName: 'Actions', sortable: false },
  ];

  const isLoading = false;

  return (
    <Box sx={{ p: 3 }}>
      <TableHeader
        title="Backup History"
        subtitle="View and monitor the history of all backup operations"
        stats={[
          {
            label: "Total Backups",
            value: backups.length,
            color: "primary"
          },
          {
            label: "Successful",
            value: backups.filter(b => b.status === 'success').length,
            color: "success"
          },
          {
            label: "Failed",
            value: backups.filter(b => b.status === 'failed').length,
            color: "error"
          },
          {
            label: "In Progress",
            value: backups.filter(b => b.status === 'in_progress').length,
            color: "warning"
          }
        ]}
      />

      <Card
        sx={{
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CustomTable
          columns={columns}
          rows={backups.map((backup) => ({
            ...backup,
            actions: (
              <div className="flex justify-end gap-1">
                <IconButton color="primary" size="small" title="View Config">
                  <ViewIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  size="small"
                  title="Download Backup"
                  disabled={backup.status.toLowerCase() === 'failed'}
                >
                  <DownloadIcon />
                </IconButton>
              </div>
            ),
            status: (
              <Chip
                label={backup.status}
                color={getStatusColor(backup.status) as any}
                size="small"
              />
            ),
          }))}
          loading={isLoading}
        />
      </Card>
    </Box>
  )
}

export default BackupHistory
