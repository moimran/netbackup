import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { Location, Site } from '../types';

interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
  location?: Location;
  sites: Site[];
  onSave: (location: Omit<Location, 'id'>) => void;
}

const initialLocationState: Omit<Location, 'id'> = {
  name: '',
  site_id: '',
  floor: '',
  room: '',
};

export const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onClose,
  location,
  sites,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<Location, 'id'>>(initialLocationState);

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        site_id: location.site_id || '',
        floor: location.floor || '',
        room: location.room || '',
      });
    } else {
      setFormData(initialLocationState);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{location ? 'Edit Location' : 'Add New Location'}</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            fullWidth
            required
            label="Location Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            select
            label="Site"
            name="site_id"
            value={formData.site_id}
            onChange={handleChange}
          >
            {sites.map((site) => (
              <MenuItem key={site.id} value={site.id}>
                {site.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Floor"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Room"
            name="room"
            value={formData.room}
            onChange={handleChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || !formData.site_id}
        >
          {location ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationDialog;
