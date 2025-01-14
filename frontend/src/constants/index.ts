import { DeviceStatus, DeviceType, StatusConfigType, DeviceTypeConfigType } from '../types';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Router as RouterIcon,
  Hub as SwitchIcon,
  Security as FirewallIcon,
} from '@mui/icons-material';

// Status configurations
export const STATUS_CONFIG: Record<DeviceStatus | 'default', StatusConfigType> = {
  [DeviceStatus.ACTIVE]: { 
    color: 'success', 
    icon: CheckCircleIcon, 
    label: 'Active',
    bgColor: 'bg-green-100 dark:bg-green-900/20' 
  },
  [DeviceStatus.INACTIVE]: { 
    color: 'error', 
    icon: ErrorIcon, 
    label: 'Inactive',
    bgColor: 'bg-red-100 dark:bg-red-900/20'
  },
  [DeviceStatus.PENDING]: { 
    color: 'warning', 
    icon: WarningIcon, 
    label: 'Pending',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
  },
  default: { 
    color: 'default', 
    icon: MoreVertIcon, 
    label: 'Unknown',
    bgColor: 'bg-gray-100 dark:bg-gray-800'
  },
};

// Device type configurations
export const DEVICE_TYPE_CONFIG: Record<DeviceType, DeviceTypeConfigType> = {
  [DeviceType.ROUTER]: {
    icon: RouterIcon,
    label: 'Router',
    color: 'text-blue-600 dark:text-blue-400'
  },
  [DeviceType.SWITCH]: {
    icon: SwitchIcon,
    label: 'Switch',
    color: 'text-green-600 dark:text-green-400'
  },
  [DeviceType.FIREWALL]: {
    icon: FirewallIcon,
    label: 'Firewall',
    color: 'text-red-600 dark:text-red-400'
  }
};

// Table configurations
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export const TABLE_CLASSES = {
  paper: {
    light: 'border border-gray-200 hover:border-gray-300 bg-white shadow-sm',
    dark: 'border border-gray-700 hover:border-gray-600 bg-gray-800 shadow-sm',
  },
  header: {
    light: 'bg-gray-50 text-gray-600 font-medium',
    dark: 'bg-gray-800 text-gray-200 font-medium',
  },
  row: {
    hover: {
      light: 'hover:bg-gray-50 transition-colors duration-150',
      dark: 'hover:bg-gray-800/50 transition-colors duration-150',
    },
    selected: {
      light: 'bg-blue-50/50 hover:bg-blue-50/75',
      dark: 'bg-blue-900/20 hover:bg-blue-900/30',
    },
  },
  cell: {
    light: 'text-gray-900',
    dark: 'text-gray-100',
  },
};

// API endpoints
export const API_ENDPOINTS = {
  DEVICES: '/api/devices',
  SITES: '/api/sites',
  LOCATIONS: '/api/locations',
  DEVICE_GROUPS: '/api/device-groups',
  DEVICE_CREDENTIALS: '/api/device-credentials',
  BACKUP_HISTORY: '/api/backup-history',
  ADMIN: '/api/admin',
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_IP: 'Please enter a valid IP address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
  PASSWORD_REQUIREMENTS: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME_MODE: 'themeMode',
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
};

// Animation durations
export const ANIMATION_DURATION = {
  SHORT: 150,
  MEDIUM: 300,
  LONG: 500,
};
