export interface Device {
  id: string;
  name: string;
  ip: string;
  type: DeviceType;
  status: DeviceStatus;
  lastBackup: string;
  nextBackup: string;
}

export type DeviceType = 'Switch' | 'Router' | 'Firewall';

export type DeviceStatus = 'active' | 'warning' | 'error';

export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  actions?: boolean;
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRowClick?: (row: T) => void;
}

export interface StatusChipProps {
  status: DeviceStatus;
  customLabel?: string;
}
