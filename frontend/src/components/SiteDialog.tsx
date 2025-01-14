import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Site } from '../types';

interface SiteDialogProps {
  open: boolean;
  onClose: () => void;
  site?: Site;
  onSave: (site: Omit<Site, 'id'>) => void;
}

const initialSiteState: Omit<Site, 'id'> = {
  name: '',
  code: '',
  description: '',
  address: '',
};

export const SiteDialog: React.FC<SiteDialogProps> = ({
  open,
  onClose,
  site,
  onSave,
}) => {
  const [formData, setFormData] = useState(
    site ? { ...site } : initialSiteState
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      name: formData.name,
      code: formData.code,
      description: formData.description,
      address: formData.address,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{site ? 'Edit Site' : 'Add New Site'}</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            fullWidth
            required
            label="Site Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            label="Site Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || !formData.code}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SiteDialog;
