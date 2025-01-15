import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import DeviceCredentialDialog from '../components/DeviceCredentialDialog';
import TableHeader from '../components/TableHeader';
import {
  Button,
  Card,
  Typography,
  useTheme,
  Alert,
  Snackbar,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Key as KeyIcon,
} from '@mui/icons-material';
import { Device, DeviceCredential, Column } from '../types';
import devicesService from '../services/devices';
import deviceCredentialsService from '../services/deviceCredentials';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DeviceCredentialsPage: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [selectedCredential, setSelectedCredential] = useState<DeviceCredential | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Queries
  const { 
    data: devices = [], 
    isLoading: isLoadingDevices,
  } = useQuery({
    queryKey: ['devices'],
    queryFn: devicesService.getAll,
  });

  const {
    data: credentials = [],
    isLoading: isLoadingCredentials,
    error: credentialsError,
  } = useQuery({
    queryKey: ['deviceCredentials'],
    queryFn: deviceCredentialsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: deviceCredentialsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceCredentials'] });
      setSuccessMessage('Device credentials created successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      console.error('Error creating credentials:', error);
      setSuccessMessage('Error creating credentials. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeviceCredential> }) =>
      deviceCredentialsService.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceCredentials'] });
      setSuccessMessage('Device credentials updated successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      console.error('Error updating credentials:', error);
      setSuccessMessage('Error updating credentials. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deviceCredentialsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceCredentials'] });
      setSuccessMessage('Device credentials deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting credentials:', error);
      setSuccessMessage('Error deleting credentials. Please try again.');
    },
  });

  const handleAdd = () => {
    setSelectedCredential(null);
    setDialogOpen(true);
  };

  const handleEdit = useCallback((credential: DeviceCredential) => {
    setSelectedCredential(credential);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (credential: DeviceCredential) => {
    if (confirm('Are you sure you want to delete these credentials?')) {
      deleteMutation.mutate(credential.id);
    }
  }, [deleteMutation]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCredential(null);
  };

  const handleSave = async (credentialData: Partial<DeviceCredential>) => {
    try {
      if (selectedCredential) {
        await updateMutation.mutateAsync({
          id: selectedCredential.id,
          data: credentialData,
        });
      } else {
        await createMutation.mutateAsync(credentialData as DeviceCredential);
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
      setSuccessMessage('Error saving credentials. Please try again.');
    }
  };

  const columns: Column<DeviceCredential>[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'username', label: 'Username', minWidth: 130 },
  ];

  if (isLoadingDevices || isLoadingCredentials) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <TableHeader
          title="Device Credentials"
          onAdd={handleAdd}
          addButtonText="Add Credentials"
        />
        
        <CustomTable
          columns={columns}
          rows={credentials}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {dialogOpen && (
          <DeviceCredentialDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            onSave={handleSave}
            credential={selectedCredential}
          />
        )}

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage(null)}
        >
          <Alert
            onClose={() => setSuccessMessage(null)}
            severity={successMessage?.toLowerCase().includes('error') ? 'error' : 'success'}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Card>
    </div>
  );
};

export default DeviceCredentialsPage;
