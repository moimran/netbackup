// Common types
export type ID = string;
export type ISODateString = string;

// Enums
export enum DeviceType {
  SWITCH = 'Switch',
  ROUTER = 'Router',
  FIREWALL = 'Firewall'
}

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

// UI Types
export type StatusConfigType = {
  color: 'success' | 'error' | 'warning' | 'default';
  icon: any;
  label: string;
  bgColor: string;
};

export type DeviceTypeConfigType = {
  icon: any;
  label: string;
  color: string;
};

// Base interfaces
interface BaseEntity {
  id: ID;
  name: string;
  description?: string;
  created_at?: ISODateString;
  updated_at?: ISODateString;
}

// Main interfaces
export interface Device extends BaseEntity {
  ip_address: string;
  type: DeviceType;
  status: DeviceStatus;
  site_id?: ID;
  location_id?: ID;
  credential_id?: ID;
  last_backup?: ISODateString;
  next_backup?: ISODateString;
  config?: Record<string, any>;
  site?: Site;
  location?: Location;
  credential?: DeviceCredential;
  groups?: DeviceGroup[];
  group_ids?: ID[];  // Add this field for API requests
}

export interface Site extends BaseEntity {
  code: string;
  address?: string;
  locations?: Location[];
}

export interface Location extends BaseEntity {
  site_id: ID;
  floor?: string;
  room?: string;
  site?: Site;
}

export interface DeviceGroup extends BaseEntity {
  devices?: Device[];
  credential_id?: ID;
  credential?: DeviceCredential;
  color?: string;
  isDefault?: boolean;
}

export interface DeviceCredential extends BaseEntity {
  username: string;
  password: string;
  device_id: string;
  ssh_key?: string;
}

export interface Admin extends BaseEntity {
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Table types
export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: T) => React.ReactNode;
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
