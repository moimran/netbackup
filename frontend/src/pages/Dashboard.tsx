import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  Typography,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Tab,
  Tabs,
  Avatar,
} from '@mui/material';
import {
  Router as RouterIcon,
  Backup as BackupIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  TrendingUp,
  Computer,
  Description,
  Person,
} from '@mui/icons-material';
import dashboardService from '../services/dashboard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [30, 55, 45, 60, 75, 65],
        borderColor: '#6366F1',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [25, 45, 35, 50, 65, 55],
        borderColor: '#EC4899',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Typography color="error" variant="h6">
        Error loading dashboard data
      </Typography>
    );
  }

  const statCards = [
    {
      title: 'Total Devices',
      value: stats?.total_devices || 0,
      icon: <Computer className="text-blue-500" />,
      change: `${stats?.active_devices || 0} active`,
      changeColor: 'text-green-500',
    },
    {
      title: 'Successful Backups',
      value: stats?.successful_backups || 0,
      icon: <CheckCircleIcon className="text-green-500" />,
      change: `${Math.round((stats?.successful_backups || 0) / (stats?.total_backups || 1) * 100)}%`,
      changeColor: 'text-green-500',
    },
    {
      title: 'Failed Backups',
      value: stats?.failed_backups || 0,
      icon: <ErrorIcon className="text-red-500" />,
      change: `${Math.round((stats?.failed_backups || 0) / (stats?.total_backups || 1) * 100)}%`,
      changeColor: 'text-red-500',
    },
    {
      title: 'Total Backups',
      value: stats?.total_backups || 0,
      icon: <BackupIcon className="text-yellow-500" />,
      change: 'Last 24 hours',
      changeColor: 'text-blue-500',
    },
  ];

  return (
    <Box className="p-6 space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Box>
          <Typography variant="h4" className="font-bold">
            Backup Dashboard
          </Typography>
          <Typography color="textSecondary">
            Monitor your network device backups and system health
          </Typography>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="p-4">
              <Box className="flex items-center justify-between mb-2">
                <Typography variant="subtitle2" color="textSecondary">
                  {stat.title}
                </Typography>
                {stat.icon}
              </Box>
              <Typography variant="h4" className="font-bold mb-1">
                {stat.value}
              </Typography>
              <Typography variant="body2" className={stat.changeColor}>
                {stat.change}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities */}
      <Card className="p-6">
        <Typography variant="h6" className="mb-4">
          RECENT ACTIVITIES
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats?.recent_activities?.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.device_name}</TableCell>
                  <TableCell>
                    <Chip
                      label={activity.status}
                      color={activity.status === 'success' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{activity.message}</TableCell>
                  <TableCell>
                    {new Date(activity.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Dashboard;
