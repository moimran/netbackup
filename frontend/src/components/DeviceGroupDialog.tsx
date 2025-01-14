import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { DeviceGroup, DeviceCredential } from '../types';

interface DeviceGroupDialogProps {
  open: boolean;
  onClose: () => void;
  group?: DeviceGroup;
  credentials: DeviceCredential[];
  onSave: (group: Omit<DeviceGroup, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const initialGroupState: Omit<DeviceGroup, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  color: '#1976d2',
  isDefault: false,
  credentialId: '',
};

export const DeviceGroupDialog: React.FC<DeviceGroupDialogProps> = ({
  open,
  onClose,
  group,
  credentials,
  onSave,
}) => {
  const [formData, setFormData] = useState(
    group 
      ? {
          name: group.name,
          description: group.description || '',
          color: group.color || '#1976d2',
          isDefault: group.isDefault || false,
          credentialId: group.credentialId || '',
        }
      : initialGroupState
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{group ? 'Edit Group' : 'Add New Group'}</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            fullWidth
            required
            label="Group Name"
            name="name"
            value={formData.name}
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
          <Box className="flex gap-4 items-center">
            <TextField
              type="color"
              label="Group Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              sx={{
                '& input[type="color"]': {
                  width: '50px',
                  height: '50px',
                  padding: '0',
                  border: 'none',
                },
              }}
            />
            <div
              className="w-10 h-10 rounded-full border"
              style={{ backgroundColor: formData.color }}
            />
          </Box>

          {/* Credential Selection */}
          <TextField
            select
            fullWidth
            label="Default Credential"
            name="credentialId"
            value={formData.credentialId}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">None</option>
            {credentials.map((credential) => (
              <option key={credential.id} value={credential.id}>
                {credential.name}
              </option>
            ))}
          </TextField>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceGroupDialog;
