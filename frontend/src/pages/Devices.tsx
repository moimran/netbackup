import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import DeviceDialog from '../components/DeviceDialog';
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
  Router as RouterIcon,
} from '@mui/icons-material';
import { Device, Site, Location, DeviceGroup, Column, DeviceType, DeviceStatus } from '../types';
import devicesService from '../services/devices';
import sitesService from '../services/sites';
import locationsService from '../services/locations';
import deviceGroupsService from '../services/deviceGroups';
import deviceCredentialsService from '../services/deviceCredentials';
import { DEVICE_TYPE_CONFIG, STATUS_CONFIG } from '../constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DevicesPage: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Queries
  const { 
    data: devices = [], 
    isLoading: isLoadingDevices,
    error: devicesError
  } = useQuery({
    queryKey: ['devices'],
    queryFn: devicesService.getAll,
  });

  const { 
    data: sites = [],
    isLoading: isLoadingSites,
  } = useQuery({
    queryKey: ['sites'],
    queryFn: sitesService.getAll,
  });

  const { 
    data: locations = [],
    isLoading: isLoadingLocations,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: locationsService.getAll,
  });

  const {
    data: deviceGroups = [],
    isLoading: isLoadingDeviceGroups,
  } = useQuery({
    queryKey: ['deviceGroups'],
    queryFn: deviceGroupsService.getAll,
  });

  const {
    data: deviceCredentials = [],
    isLoading: isLoadingCredentials,
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
    mutationFn: devicesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setSuccessMessage('Device created successfully');
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Device> }) =>
      devicesService.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setSuccessMessage('Device updated successfully');
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: devicesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setSuccessMessage('Device deleted successfully');
    },
  });

  const handleAdd = () => {
    setSelectedDevice(null);
    setDialogOpen(true);
  };

  const handleEdit = useCallback((device: Device) => {
    setSelectedDevice(device);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (device: Device) => {
    if (confirm('Are you sure you want to delete this device?')) {
      deleteMutation.mutate(device.id);
    }
  }, [deleteMutation]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDevice(null);
  };

  const handleSave = async (deviceData: Partial<Device>) => {
    if (selectedDevice) {
      updateMutation.mutate({
        id: selectedDevice.id,
        data: deviceData,
      });
    } else {
      createMutation.mutate(deviceData as Device);
    }
  };

  const columns: Column<Device>[] = [
    { id: 'name', label: 'Device Name', minWidth: 170 },
    { id: 'ip_address', label: 'IP Address', minWidth: 130 },
    {
      id: 'type',
      label: 'Type',
      minWidth: 100,
      format: (value: DeviceType) => DEVICE_TYPE_CONFIG[value]?.label || value,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value: DeviceStatus) => (
        <Chip
          label={STATUS_CONFIG[value]?.label || value}
          color={STATUS_CONFIG[value]?.color || 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'site',
      label: 'Site',
      minWidth: 170,
      format: (value?: Site) => value?.name || '-',
    },
    {
      id: 'location',
      label: 'Location',
      minWidth: 170,
      format: (value?: Location) => value?.name || '-',
    },
    {
      id: 'device_group',
      label: 'Device Group',
      minWidth: 170,
      format: (value?: DeviceGroup) => value?.name || '-',
    },
  ];

  if (isLoadingDevices || isLoadingSites || isLoadingLocations || isLoadingDeviceGroups) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (devicesError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading devices. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" className="font-semibold mb-1">
            Devices
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your network devices
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add Device
        </Button>
      </div>

      {/* Device Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`p-4 rounded-xl hover:shadow-md transition-shadow duration-200 ${
            theme.palette.mode === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <RouterIcon className="text-blue-500" />
            <Typography variant="h6" className="font-medium">
              Total Devices
            </Typography>
          </div>
          <Typography variant="h4" className="font-bold text-blue-600">
            {devices.length}
          </Typography>
        </Card>
      </div>

      <CustomTable<Device>
        columns={columns}
        rows={devices}
        loading={isLoadingDevices}
        actions
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {dialogOpen && (
        <DeviceDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          device={selectedDevice}
          onSave={handleSave}
          sites={sites}
          locations={locations}
          deviceGroups={deviceGroups}
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

export default DevicesPage;
