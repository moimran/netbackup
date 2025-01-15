import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import DeviceGroupDialog from '../components/DeviceGroupDialog';
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
  Group as GroupIcon,
} from '@mui/icons-material';
import { Device, DeviceGroup, Column } from '../types';
import deviceGroupsService from '../services/deviceGroups';
import devicesService from '../services/devices';
import deviceCredentialsService from '../services/deviceCredentials';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DeviceGroupsPage: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState<DeviceGroup | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Queries
  const { 
    data: groups = [], 
    isLoading: isLoadingGroups,
    error: groupsError
  } = useQuery({
    queryKey: ['deviceGroups'],
    queryFn: deviceGroupsService.getAll,
  });

  const { 
    data: devices = [],
    isLoading: isLoadingDevices,
  } = useQuery({
    queryKey: ['devices'],
    queryFn: devicesService.getAll,
  });

  const {
    data: deviceCredentials = [],
    isLoading: isLoadingCredentials,
  } = useQuery({
    queryKey: ['deviceCredentials'],
    queryFn: deviceCredentialsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: deviceGroupsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceGroups'] });
      setSuccessMessage('Device group created successfully');
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DeviceGroup> }) =>
      deviceGroupsService.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceGroups'] });
      setSuccessMessage('Device group updated successfully');
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deviceGroupsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceGroups'] });
      setSuccessMessage('Device group deleted successfully');
    },
  });

  const handleAdd = () => {
    setSelectedGroup(null);
    setDialogOpen(true);
  };

  const handleEdit = useCallback((group: DeviceGroup) => {
    setSelectedGroup(group);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (group: DeviceGroup) => {
    if (confirm('Are you sure you want to delete this device group?')) {
      deleteMutation.mutate(group.id);
    }
  }, [deleteMutation]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedGroup(null);
  };

  const handleSave = async (groupData: Partial<DeviceGroup>) => {
    if (selectedGroup) {
      updateMutation.mutate({
        id: selectedGroup.id,
        data: groupData,
      });
    } else {
      createMutation.mutate(groupData as DeviceGroup);
    }
  };

  const columns: Column<DeviceGroup>[] = [
    { id: 'name', label: 'Group Name', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 200, format: (value) => value || '-' },
    {
      id: 'devices',
      label: 'Devices',
      minWidth: 100,
      format: (value: Device[]) => {
        const count = Array.isArray(value) ? value.length : 0;
        return (
          <Chip
            label={`${count} device${count !== 1 ? 's' : ''}`}
            size="small"
            color="primary"
            title={Array.isArray(value) ? value.map(d => d.name).join(', ') : 'No devices'}
          />
        );
      },
    },
  ];

  if (isLoadingGroups || isLoadingDevices) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (groupsError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading device groups. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <TableHeader
        title="Device Groups"
        subtitle="Organize and manage your network devices in logical groups"
        stats={[
          {
            label: "Total Groups",
            value: groups.length,
            color: "primary"
          },
          {
            label: "Active Groups",
            value: groups.filter(g => g.status === 'active').length,
            color: "success"
          },
          {
            label: "Total Devices",
            value: groups.reduce((acc, group) => acc + (group.devices?.length || 0), 0),
            color: "info"
          }
        ]}
        onAdd={handleAdd}
        addButtonLabel="Add Group"
      />

      <Card
        sx={{
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CustomTable<DeviceGroup>
          columns={columns}
          rows={groups}
          loading={isLoadingGroups}
          actions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {dialogOpen && (
        <DeviceGroupDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          group={selectedGroup}
          onSave={handleSave}
          devices={devices}
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

export default DeviceGroupsPage;
