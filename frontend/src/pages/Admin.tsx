import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { CustomTable } from '../components/CustomTable';
import adminService from '../services/admin';
import { Admin } from '../types';

const AdminPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    status: 'active',
  });

  // Queries
  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: adminService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      setSuccessMessage('Admin created successfully');
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Admin> }) =>
      adminService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      setSuccessMessage('Admin updated successfully');
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      setSuccessMessage('Admin deleted successfully');
    },
  });

  const handleAdd = () => {
    setSelectedAdmin(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'admin',
      status: 'active',
    });
    setDialogOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      role: admin.role,
      status: admin.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (admin: Admin) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      deleteMutation.mutate(admin.id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleSubmit = async () => {
    const adminData = {
      ...formData,
      password: formData.password || undefined, // Only include password if it's not empty
    };

    if (selectedAdmin) {
      updateMutation.mutate({
        id: selectedAdmin.id,
        data: adminData,
      });
    } else {
      createMutation.mutate(adminData as any);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    { id: 'username', label: 'Username', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'role', label: 'Role', minWidth: 130 },
    { id: 'status', label: 'Status', minWidth: 130 },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 170,
      format: (value: any, row: Admin) => (
        <Box>
          <IconButton onClick={() => handleEdit(row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" className="font-semibold mb-1">
            Admin Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage admin users and their permissions
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          Add Admin
        </Button>
      </div>

      <Card>
        <CustomTable
          columns={columns}
          rows={admins}
          loading={isLoading}
        />
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedAdmin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required={!selectedAdmin}
              helperText={selectedAdmin ? 'Leave blank to keep current password' : ''}
            />
            <TextField
              label="Role"
              name="role"
              select
              value={formData.role}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="super_admin">Super Admin</MenuItem>
            </TextField>
            <TextField
              label="Status"
              name="status"
              select
              value={formData.status}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.username || !formData.email || (!selectedAdmin && !formData.password)}
          >
            {selectedAdmin ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminPage;
