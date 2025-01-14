import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import DeviceCredentialDialog from '../components/DeviceCredentialDialog';
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
    queryFn: async () => {
      if (!devices) return [];
      const credentialsList = await Promise.all(
        devices.map(async (device) => {
          try {
            return await deviceCredentialsService.getCredentials(device.id);
          } catch (error) {
            return null;
          }
        })
      );
      return credentialsList.filter((cred): cred is DeviceCredential => cred !== null);
    },
    enabled: !!devices,
  });

  const createMutation = useMutation({
    mutationFn: deviceCredentialsService.createCredentials,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceCredentials'] });
      setSuccessMessage('Device credentials created successfully');
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DeviceCredential> }) =>
      deviceCredentialsService.updateCredentials(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceCredentials'] });
      setSuccessMessage('Device credentials updated successfully');
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deviceCredentialsService.deleteCredentials,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceCredentials'] });
      setSuccessMessage('Device credentials deleted successfully');
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
    if (selectedCredential) {
      updateMutation.mutate({
        id: selectedCredential.id,
        data: credentialData,
      });
    } else {
      createMutation.mutate(credentialData as DeviceCredential);
    }
  };

  const columns: Column<DeviceCredential>[] = [
    {
      id: 'name',
      label: 'Credential Name',
      minWidth: 170,
    },
    { id: 'username', label: 'Username', minWidth: 130 },
    {
      id: 'password',
      label: 'Password',
      minWidth: 130,
      format: () => '••••••••',
    },
    {
      id: 'type',
      label: 'Type',
      minWidth: 100,
      format: (value: string) => (
        <Chip
          label={value}
          color="primary"
          size="small"
        />
      ),
    },
  ];

  if (isLoadingDevices || isLoadingCredentials) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (credentialsError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading device credentials. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" className="font-semibold mb-1">
            Device Credentials
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage device access credentials
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add Credentials
        </Button>
      </div>

      {/* Credentials Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`p-4 rounded-xl hover:shadow-md transition-shadow duration-200 ${
            theme.palette.mode === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <KeyIcon className="text-blue-500" />
            <Typography variant="h6" className="font-medium">
              Total Credentials
            </Typography>
          </div>
          <Typography variant="h4" className="font-bold text-blue-600">
            {credentials.length}
          </Typography>
        </Card>
      </div>

      <CustomTable<DeviceCredential>
        columns={columns}
        rows={credentials}
        loading={isLoadingCredentials}
        actions
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {dialogOpen && (
        <DeviceCredentialDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          credential={selectedCredential}
          onSave={handleSave}
          devices={devices}
        />
      )}

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

export default DeviceCredentialsPage;
