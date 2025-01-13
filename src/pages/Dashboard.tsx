import { Card, CardContent, Typography, Grid } from '@mui/material'
import {
  Storage as StorageIcon,
  Router as RouterIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material'

const Dashboard = () => {
  // Mock data - will be replaced with real data from API
  const stats = [
    { title: 'Total Devices', value: '24', icon: <RouterIcon sx={{ fontSize: 40 }} />, color: 'primary' },
    { title: 'Total Backups', value: '156', icon: <StorageIcon sx={{ fontSize: 40 }} />, color: 'info' },
    { title: 'Successful', value: '145', icon: <CheckCircleIcon sx={{ fontSize: 40 }} />, color: 'success' },
    { title: 'Failed', value: '11', icon: <ErrorIcon sx={{ fontSize: 40 }} />, color: 'error' },
  ]

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} className="w-full">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="h-full">
              <CardContent className="flex items-center justify-between h-full">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4">{stat.value}</Typography>
                </div>
                <div className={`text-${stat.color}`}>{stat.icon}</div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Section */}
      <Card className="mt-6 w-full">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          {/* Add activity list component here */}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
