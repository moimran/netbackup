import React, { memo } from 'react';
import { Chip } from '@mui/material';
import { StatusChipProps } from '../types';
import { STATUS_CONFIG } from '../constants';

export const StatusChip: React.FC<StatusChipProps> = memo(({ status, customLabel }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;
  const Icon = config.icon;

  return (
    <Chip
      icon={<Icon style={{ fontSize: 16 }} />}
      label={customLabel || config.label}
      size="small"
      color={config.color}
      className="capitalize transition-all duration-300 hover:shadow-md"
    />
  );
});
