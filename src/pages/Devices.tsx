import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Link,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Backup as BackupIcon,
} from '@mui/icons-material'

interface Device {
  id: number
  name: string
  ip: string
  type: string
  status: string
  lastBackup: string
  model: string
  location: string
  firmware: string
  configBackups: number
  lastConfigChange: string
  notes: string
}

interface DeviceDetailsProps {
  device: Device
  open: boolean
  onClose: () => void
}

const Devices = () => {
  const [open, setOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      name: 'Core Switch',
      ip: '192.168.1.1',
      type: 'Cisco',
      status: 'Online',
      lastBackup: '2025-01-12 20:30',
      model: 'Cisco ISR 4321',
      location: 'Server Room A',
      firmware: 'v15.7(3)M8',
      configBackups: 23,
      lastConfigChange: '2024-01-11 09:15',
      notes: 'Primary edge router for main office',
    },
    {
      id: 2,
      name: 'Edge Router',
      ip: '192.168.1.2',
      type: 'Juniper',
      status: 'Online',
      lastBackup: '2025-01-12 20:00',
      model: 'Juniper SRX 300',
      location: 'Server Room B',
      firmware: 'v18.4R3-S6',
      configBackups: 17,
      lastConfigChange: '2024-01-10 14:30',
      notes: 'Secondary edge router for main office',
    },
  ])

  const deviceTypes = ['Cisco', 'Juniper', 'HP', 'Arista', 'Other']

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device)
    setDetailsOpen(true)
  }

  const handleDetailsClose = () => {
    setDetailsOpen(false)
    setSelectedDevice(null)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'success'
      case 'offline':
        return 'error'
      case 'maintenance':
        return 'warning'
      default:
        return 'default'
    }
  }

  const DeviceDetails = ({ device, open, onClose }: DeviceDetailsProps) => {
    const details = [
      { label: 'Name', value: device.name },
      { label: 'IP Address', value: device.ip },
      { label: 'Type', value: device.type },
      { label: 'Model', value: device.model },
      { label: 'Location', value: device.location },
      { label: 'Firmware Version', value: device.firmware },
      { label: 'Status', value: device.status },
      { label: 'Last Backup', value: device.lastBackup },
      { label: 'Total Config Backups', value: device.configBackups },
      { label: 'Last Config Change', value: device.lastConfigChange },
    ]

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Device Details</Typography>
            <Chip
              label={device.status}
              color={getStatusColor(device.status) as any}
              size="small"
            />
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-2 gap-4">
            {details.map((detail) => (
              <div key={detail.label} className="flex flex-col">
                <Typography variant="caption" color="textSecondary">
                  {detail.label}
                </Typography>
                <Typography>{detail.value}</Typography>
              </div>
            ))}
          </div>
          {device.notes && (
            <div className="mt-4">
              <Typography variant="caption" color="textSecondary">
                Notes
              </Typography>
              <Typography>{device.notes}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Network Devices</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Device
        </Button>
      </div>

      <div className="w-full h-[calc(100%-5rem)] overflow-auto">
        <TableContainer component={Paper} className="w-full shadow-md">
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Backup</TableCell>
                <TableCell align="right" width="120">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <Link
                      component="button"
                      onClick={() => handleDeviceClick(device)}
                      underline="hover"
                      color="primary"
                    >
                      {device.name}
                    </Link>
                  </TableCell>
                  <TableCell>{device.ip}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={device.status}
                      color={getStatusColor(device.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{device.lastBackup}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <IconButton color="primary" size="small" title="Backup Now">
                        <BackupIcon />
                      </IconButton>
                      <IconButton color="primary" size="small" title="Edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" size="small" title="Delete">
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Add/Edit Device Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Device</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Device Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="IP Address"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Device Type"
            select
            fullWidth
            variant="outlined"
          >
            {deviceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Device Details Dialog */}
      {selectedDevice && (
        <DeviceDetails
          device={selectedDevice}
          open={detailsOpen}
          onClose={handleDetailsClose}
        />
      )}
    </div>
  )
}

export default Devices
