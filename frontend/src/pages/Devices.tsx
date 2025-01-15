import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import DeviceDialog from '../components/DeviceDialog';
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
    queryFn: deviceCredentialsService.getAll,
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

  const addToGroupMutation = useMutation({
    mutationFn: ({ groupId, deviceId }: { groupId: string; deviceId: string }) =>
      deviceGroupsService.addDevice(groupId, deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceGroups'] });
      queryClient.invalidateQueries({ queryKey: ['devices'] });
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
    try {
      if (selectedDevice) {
        // Update device
        await updateMutation.mutateAsync({
          id: selectedDevice.id,
          data: deviceData,
        });

        // Handle group changes
        const oldGroups = selectedDevice.groups || [];
        const newGroups = deviceData.groups || [];
        
        // Add device to new groups
        const groupsToAdd = newGroups.filter(
          newGroup => !oldGroups.some(oldGroup => oldGroup.id === newGroup.id)
        );
        
        for (const group of groupsToAdd) {
          await addToGroupMutation.mutateAsync({
            groupId: group.id,
            deviceId: selectedDevice.id,
          });
        }
      } else {
        // Create new device
        const createdDevice = await createMutation.mutateAsync(deviceData as Device);
        
        // Add device to selected groups
        if (deviceData.groups) {
          for (const group of deviceData.groups) {
            await addToGroupMutation.mutateAsync({
              groupId: group.id,
              deviceId: createdDevice.id,
            });
          }
        }
      }

      setSuccessMessage(selectedDevice ? 'Device updated successfully' : 'Device created successfully');
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving device:', error);
      setSuccessMessage('Error saving device. Please try again.');
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
      format: (_, row: Device) => {
        if (row.site?.name) return row.site.name;
        const site = sites.find(s => s.id === row.site_id);
        return site?.name || '-';
      },
    },
    {
      id: 'groups',
      label: 'Device Groups',
      minWidth: 170,
      format: (value: DeviceGroup[]) => 
        value && value.length > 0 
          ? value.map(group => group.name).join(', ') 
          : '-',
    },
    {
      id: 'location',
      label: 'Location',
      minWidth: 170,
      format: (value: Location) => value?.name || '-',
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
    <Box sx={{ p: 3 }}>
      <TableHeader
        title="Network Devices"
        subtitle="Manage and monitor your network devices across all locations"
        stats={[
          {
            label: "Total Devices",
            value: devices.length,
            color: "primary"
          },
          {
            label: "Active",
            value: devices.filter(d => d.status === DeviceStatus.Active).length,
            color: "success"
          },
          {
            label: "Inactive",
            value: devices.filter(d => d.status === DeviceStatus.Inactive).length,
            color: "error"
          }
        ]}
        onAdd={() => setDialogOpen(true)}
        addButtonLabel="Add Device"
      />

      <Card
        sx={{
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CustomTable<Device>
          columns={columns}
          rows={devices}
          loading={isLoadingDevices}
          actions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {dialogOpen && (
        <DeviceDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          device={selectedDevice}
          onSave={handleSave}
          sites={sites}
          locations={locations}
          groups={deviceGroups}
          credentials={deviceCredentials}
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
    </Box>
  );
};

export default DevicesPage;
