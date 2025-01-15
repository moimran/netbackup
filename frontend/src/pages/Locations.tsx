import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import LocationDialog from '../components/LocationDialog';
import TableHeader from '../components/TableHeader';
import {
  Button,
  Card,
  Typography,
  useTheme,
  Alert,
  Snackbar,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Location, Site, Column } from '../types';
import locationsService from '../services/locations';
import sitesService from '../services/sites';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const LocationsPage: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Queries
  const { 
    data: locations = [], 
    isLoading: isLoadingLocations,
    error: locationsError
  } = useQuery({
    queryKey: ['locations'],
    queryFn: locationsService.getAll,
  });

  const { 
    data: sites = [],
    isLoading: isLoadingSites,
  } = useQuery({
    queryKey: ['sites'],
    queryFn: sitesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: locationsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setSuccessMessage('Location created successfully');
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Location> }) =>
      locationsService.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setSuccessMessage('Location updated successfully');
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: locationsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setSuccessMessage('Location deleted successfully');
    },
  });

  const handleAdd = () => {
    setSelectedLocation(null);
    setDialogOpen(true);
  };

  const handleEdit = useCallback((location: Location) => {
    setSelectedLocation(location);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (location: Location) => {
    if (confirm('Are you sure you want to delete this location?')) {
      deleteMutation.mutate(location.id);
    }
  }, [deleteMutation]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedLocation(null);
  };

  const handleSave = async (locationData: Partial<Location>) => {
    if (selectedLocation) {
      updateMutation.mutate({
        id: selectedLocation.id,
        data: locationData,
      });
    } else {
      createMutation.mutate(locationData as Location);
    }
  };

  const columns: Column<Location>[] = [
    { id: 'name', label: 'Location Name', minWidth: 170 },
    { id: 'code', label: 'Location Code', minWidth: 100 },
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      format: (value?: string) => value || '-',
    },
    {
      id: 'site',
      label: 'Site',
      minWidth: 170,
      format: (value?: Site) => value?.name || '-',
    },
    { id: 'address', label: 'Address', minWidth: 200 },
  ];

  if (isLoadingLocations || isLoadingSites) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (locationsError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading locations. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <TableHeader
        title="Network Locations"
        subtitle="Manage physical locations of your network infrastructure"
        stats={[
          {
            label: "Total Locations",
            value: locations.length,
            color: "primary"
          },
          {
            label: "Active",
            value: locations.filter(l => l.status === 'active').length,
            color: "success"
          }
        ]}
        onAdd={handleAdd}
        addButtonLabel="Add Location"
      />

      <Card
        sx={{
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.4)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CustomTable<Location>
          columns={columns}
          rows={locations}
          loading={isLoadingLocations}
          actions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {dialogOpen && (
        <LocationDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          location={selectedLocation}
          onSave={handleSave}
          sites={sites}
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

export default LocationsPage;
