import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Device, Site, Location, DeviceGroup, DeviceCredential, DeviceType, DeviceStatus } from '../types';
import { DEVICE_TYPE_CONFIG, STATUS_CONFIG } from '../constants';

interface DeviceDialogProps {
  open: boolean;
  onClose: () => void;
  device?: Device | null;
  sites: Site[];
  locations: Location[];
  groups: DeviceGroup[];
  credentials: DeviceCredential[];
  onSave: (deviceData: Partial<Device>) => void;
}

const initialDeviceState: Partial<Device> = {
  name: '',
  ip_address: '',
  type: DeviceType.SWITCH,
  status: DeviceStatus.INACTIVE,
  site_id: '',
  location_id: '',
  credential_id: '',
  groups: [],
  group_ids: [],
  config: {},
};

const DeviceDialog: React.FC<DeviceDialogProps> = ({
  open,
  onClose,
  device,
  sites = [],
  locations = [],
  groups = [],
  credentials = [],
  onSave,
}) => {
  const [formData, setFormData] = useState(
    device 
      ? {
          ...device,
          groups: device.groups || [],
          group_ids: device.groups?.map(g => g.id) || [],
          // Validate credential_id exists in available credentials
          credential_id: credentials.some(c => c.id === device.credential_id) 
            ? device.credential_id 
            : '',
        }
      : initialDeviceState
  );

  useEffect(() => {
    if (device) {
      setFormData({
        ...device,
        groups: device.groups || [],
        group_ids: device.groups?.map(g => g.id) || [],
        credential_id: credentials.some(c => c.id === device.credential_id) 
          ? device.credential_id 
          : '',
      });
    } else {
      setFormData(initialDeviceState);
    }
  }, [device]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupChange = (_: any, newGroups: DeviceGroup[]) => {
    setFormData((prev) => ({
      ...prev,
      groups: newGroups,
      group_ids: newGroups.map(g => g.id)
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const filteredLocations = locations.filter(
    (location) => !formData.site_id || location.site_id === formData.site_id
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{device ? 'Edit Device' : 'Add New Device'}</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            fullWidth
            label="Device Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="IP Address"
            name="ip_address"
            value={formData.ip_address || ''}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            select
            label="Device Type"
            name="type"
            value={formData.type || DeviceType.SWITCH}
            onChange={handleChange}
            required
          >
            {Object.values(DeviceType).map((type) => (
              <MenuItem key={type} value={type}>
                {DEVICE_TYPE_CONFIG[type]?.label || type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={formData.status || DeviceStatus.INACTIVE}
            onChange={handleChange}
            required
          >
            {Object.values(DeviceStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {STATUS_CONFIG[status]?.label || status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Site"
            name="site_id"
            value={formData.site_id || ''}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {sites.map((site) => (
              <MenuItem key={site.id} value={site.id}>
                {site.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Location"
            name="location_id"
            value={formData.location_id || ''}
            onChange={handleChange}
            disabled={!formData.site_id}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {filteredLocations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.name}
              </MenuItem>
            ))}
          </TextField>
          <Autocomplete
            multiple
            options={groups}
            value={formData.groups || []}
            onChange={handleGroupChange}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                  className="bg-blue-100 text-blue-800"
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Groups" placeholder="Select groups" />
            )}
          />
          <TextField
            fullWidth
            select
            label="Device Credentials"
            name="credential_id"
            value={formData.credential_id || ''}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {credentials.map((credential) => (
              <MenuItem key={credential.id} value={credential.id}>
                {credential.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {device ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceDialog;
