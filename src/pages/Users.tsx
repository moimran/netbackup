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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Link,
  Chip,
  Avatar
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  department: string
  phoneNumber: string
  createdAt: string
  permissions: string[]
  notes?: string
}

interface UserDetailsProps {
  user: User
  open: boolean
  onClose: () => void
}

const UserDetails = ({ user, open, onClose }: UserDetailsProps) => {
  const details = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role },
    { label: 'Department', value: user.department },
    { label: 'Phone', value: user.phoneNumber },
    { label: 'Last Login', value: user.lastLogin },
    { label: 'Created', value: user.createdAt },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex items-center gap-4">
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <PersonIcon />
          </Avatar>
          <div className="flex-1">
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          </div>
          <Chip
            label={user.status}
            color={user.status.toLowerCase() === 'active' ? 'success' : 'error'}
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
        
        <div className="mt-4">
          <Typography variant="caption" color="textSecondary">
            Permissions
          </Typography>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.permissions.map((permission) => (
              <Chip
                key={permission}
                label={permission}
                size="small"
                variant="outlined"
              />
            ))}
          </div>
        </div>

        {user.notes && (
          <div className="mt-4">
            <Typography variant="caption" color="textSecondary">
              Notes
            </Typography>
            <Typography>{user.notes}</Typography>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

const Users = () => {
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Administrator',
      status: 'Active',
      department: 'IT Operations',
      phoneNumber: '+1 (555) 123-4567',
      lastLogin: '2025-01-12 23:45',
      createdAt: '2024-12-01',
      permissions: ['Manage Users', 'Manage Devices', 'View Reports', 'Perform Backups'],
      notes: 'Primary system administrator responsible for network infrastructure'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Network Engineer',
      status: 'Active',
      department: 'Network Operations',
      phoneNumber: '+1 (555) 987-6543',
      lastLogin: '2025-01-12 22:30',
      createdAt: '2024-12-15',
      permissions: ['View Devices', 'Perform Backups', 'View Reports'],
      notes: 'Handles network device configuration and maintenance'
    }
  ])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setDetailsOpen(true)
  }

  const handleDetailsClose = () => {
    setDetailsOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add User
        </Button>
      </div>

      <div className="w-full h-[calc(100%-5rem)] overflow-auto">
        <TableContainer component={Paper} className="w-full shadow-md">
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" width="120">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link
                      component="button"
                      onClick={() => handleUserClick(user)}
                      underline="hover"
                      color="primary"
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={user.status.toLowerCase() === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <IconButton color="primary" size="small" title="Edit User">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" size="small" title="Delete User">
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

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Role"
            select
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

      {/* User Details Dialog */}
      {selectedUser && (
        <UserDetails
          user={selectedUser}
          open={detailsOpen}
          onClose={handleDetailsClose}
        />
      )}
    </div>
  )
}

export default Users
