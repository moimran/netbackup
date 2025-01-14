import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import DeviceGroupDialog from '../components/DeviceGroupDialog';
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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" className="font-semibold mb-1">
            Device Groups
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your device groups
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add Group
        </Button>
      </div>

      {/* Group Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`p-4 rounded-xl hover:shadow-md transition-shadow duration-200 ${
            theme.palette.mode === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <GroupIcon className="text-blue-500" />
            <Typography variant="h6" className="font-medium">
              Total Groups
            </Typography>
          </div>
          <Typography variant="h4" className="font-bold text-blue-600">
            {groups.length}
          </Typography>
        </Card>
      </div>

      <CustomTable<DeviceGroup>
        columns={columns}
        rows={groups}
        loading={isLoadingGroups}
        actions
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {dialogOpen && (
        <DeviceGroupDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          group={selectedGroup}
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

export default DeviceGroupsPage;
