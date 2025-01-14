import React, { useState, useCallback } from 'react';
import { CustomTable } from '../components/CustomTable';
import SiteDialog from '../components/SiteDialog';
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
import { Site, Column } from '../types';
import sitesService from '../services/sites';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SitesPage: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Queries
  const { 
    data: sites = [], 
    isLoading,
    error: sitesError
  } = useQuery({
    queryKey: ['sites'],
    queryFn: sitesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: sitesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setSuccessMessage('Site created successfully');
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Site> }) =>
      sitesService.update({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setSuccessMessage('Site updated successfully');
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sitesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      setSuccessMessage('Site deleted successfully');
    },
  });

  const handleAdd = () => {
    setSelectedSite(null);
    setDialogOpen(true);
  };

  const handleEdit = useCallback((site: Site) => {
    setSelectedSite(site);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async (site: Site) => {
    if (confirm('Are you sure you want to delete this site?')) {
      deleteMutation.mutate(site.id);
    }
  }, [deleteMutation]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSite(null);
  };

  const handleSave = async (siteData: Partial<Site>) => {
    if (selectedSite) {
      updateMutation.mutate({
        id: selectedSite.id,
        data: siteData,
      });
    } else {
      createMutation.mutate(siteData as Site);
    }
  };

  const columns: Column<Site>[] = [
    { id: 'name', label: 'Site Name', minWidth: 170 },
    { id: 'code', label: 'Site Code', minWidth: 100 },
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      format: (value?: string) => value || '-',
    },
    { id: 'address', label: 'Address', minWidth: 200 },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (sitesError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading sites. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h5" className="font-semibold mb-1">
            Sites
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your network sites
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add Site
        </Button>
      </div>

      {/* Site Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`p-4 rounded-xl hover:shadow-md transition-shadow duration-200 ${
            theme.palette.mode === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <LocationIcon className="text-blue-500" />
            <Typography variant="h6" className="font-medium">
              Total Sites
            </Typography>
          </div>
          <Typography variant="h4" className="font-bold text-blue-600">
            {sites.length}
          </Typography>
        </Card>
      </div>

      <CustomTable<Site>
        columns={columns}
        rows={sites}
        loading={isLoading}
        actions
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {dialogOpen && (
        <SiteDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          site={selectedSite}
          onSave={handleSave}
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

export default SitesPage;
