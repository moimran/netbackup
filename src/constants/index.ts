import { DeviceStatus } from '../types';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

export const STATUS_CONFIG: Record<DeviceStatus | 'default', {
  color: 'success' | 'error' | 'warning' | 'default';
  icon: typeof CheckCircleIcon;
  label: string;
}> = {
  active: { color: 'success', icon: CheckCircleIcon, label: 'Active' },
  error: { color: 'error', icon: ErrorIcon, label: 'Error' },
  warning: { color: 'warning', icon: WarningIcon, label: 'Warning' },
  default: { color: 'default', icon: MoreVertIcon, label: 'Unknown' },
};

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export const TABLE_CLASSES = {
  paper: {
    light: 'border-gray-200 hover:border-gray-300',
    dark: 'border-gray-700 hover:border-gray-600',
  },
  header: {
    light: 'bg-gray-50 text-gray-600',
    dark: 'bg-gray-800 text-gray-200',
  },
  row: {
    hover: {
      light: 'hover:bg-gray-50',
      dark: 'hover:bg-gray-800/50',
    },
    selected: {
      light: 'bg-blue-50/50',
      dark: 'bg-blue-900/20',
    },
  },
};
