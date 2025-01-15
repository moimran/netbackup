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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            background: theme => theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #60A5FA, #34D399)'
              : 'linear-gradient(45deg, #2563EB, #059669)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Backup Dashboard
        </Typography>
        <Typography 
          color="textSecondary"
          sx={{ 
            fontSize: '1.1rem',
            maxWidth: 600,
          }}
        >
          Monitor your network device backups and system health
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: (theme) =>
                    `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography 
                  variant="subtitle2" 
                  color="textSecondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {stat.title}
                </Typography>
                <Box 
                  sx={{ 
                    p: 1,
                    borderRadius: '12px',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  fontSize: '2rem',
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                variant="body2" 
                className={stat.changeColor}
                sx={{ 
                  mt: 'auto',
                  fontWeight: 500,
                }}
              >
                {stat.change}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities */}
      <Card 
        sx={{ 
          p: 0,
          overflow: 'hidden',
          '& .MuiTableCell-root': {
            borderColor: theme => theme.palette.divider,
          },
        }}
      >
        <Box 
          sx={{ 
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Recent Activities
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  Device
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  Status
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  Message
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats?.recent_activities?.map((activity) => (
                <TableRow 
                  key={activity.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RouterIcon sx={{ color: 'primary.main' }} />
                      <Typography>{activity.device_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={activity.status}
                      color={activity.status === 'success' ? 'success' : 'error'}
                      size="small"
                      sx={{ 
                        borderRadius: '6px',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      sx={{ 
                        maxWidth: 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {activity.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                      {new Date(activity.created_at).toLocaleString()}
                    </Typography>
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
