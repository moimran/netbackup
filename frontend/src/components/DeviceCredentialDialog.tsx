import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { DeviceCredential } from '../types';

interface DeviceCredentialDialogProps {
  open: boolean;
  onClose: () => void;
  credential?: DeviceCredential;
  onSave: (credential: Omit<DeviceCredential, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const DeviceCredentialDialog: React.FC<DeviceCredentialDialogProps> = ({
  open,
  onClose,
  credential,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    ssh_key: '',
    device_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (credential) {
      setFormData({
        name: credential.name,
        username: credential.username,
        password: credential.password,
        ssh_key: credential.ssh_key || '',
        device_id: credential.device_id,
      });
    } else {
      setFormData({
        name: '',
        username: '',
        password: '',
        ssh_key: '',
        device_id: '',
      });
    }
  }, [credential]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err) {
      setError('Failed to save credential');
      console.error('Error saving credential:', err);
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.name && formData.username && formData.password && formData.device_id;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{credential ? 'Edit Credential' : 'Add New Credential'}</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          <TextField
            label="Credential Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
          
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="SSH Key"
            name="ssh_key"
            value={formData.ssh_key}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          
          <TextField
            label="Device ID"
            name="device_id"
            value={formData.device_id}
            onChange={handleChange}
            fullWidth
            required
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceCredentialDialog;
