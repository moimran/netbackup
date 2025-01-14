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

  return (
    <div className="h-full">
      <Typography variant="h4" gutterBottom>
        Backup History
      </Typography>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <TextField
          select
          label="Time Period"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="success">Success</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
        </TextField>
      </div>

      <TableContainer component={Paper} className="w-full shadow-md">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>File Size</TableCell>
              <TableCell align="right" width="120">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {backups.map((backup) => (
              <TableRow key={backup.id}>
                <TableCell>{backup.deviceName}</TableCell>
                <TableCell>{backup.deviceIp}</TableCell>
                <TableCell>{backup.timestamp}</TableCell>
                <TableCell>
                  <Chip
                    label={backup.status}
                    color={getStatusColor(backup.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{backup.fileSize}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BackupHistory
