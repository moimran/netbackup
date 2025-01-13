import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Router as RouterIcon,
  History as HistoryIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  InputBase,
  Badge
} from '@mui/material'
import { useThemeContext } from '../theme/ThemeContext'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const { toggleColorMode } = useThemeContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/users', label: 'Users', icon: <PeopleIcon /> },
    { path: '/devices', label: 'Devices', icon: <RouterIcon /> },
    { path: '/backup-history', label: 'Backup History', icon: <HistoryIcon /> },
  ]

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    navigate('/login')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className={`h-screen flex flex-col ${theme.palette.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation */}
      <header className={`h-16 flex items-center justify-between px-4 border-b ${
        theme.palette.mode === 'dark' 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
          : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
      } backdrop-blur-sm backdrop-saturate-150`}>
        {/* Left section */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <IconButton 
              onClick={toggleSidebar} 
              size="small"
              className="hover:rotate-180 transition-transform duration-300"
            >
              {isSidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center gap-2">
                <img 
                  src="/logo.svg" 
                  alt="NetBackup Logo" 
                  className="h-8 w-8 transform group-hover:scale-110 transition-transform duration-300" 
                />
                <Typography 
                  variant="h6" 
                  className="font-semibold hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
                >
                  NetBackup
                </Typography>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className={`flex items-center px-3 py-1.5 rounded-lg ${
            theme.palette.mode === 'dark' 
              ? 'bg-gray-700/50 hover:bg-gray-700/70' 
              : 'bg-gray-100/80 hover:bg-gray-100'
          } backdrop-blur-sm transition-colors duration-200`}>
            <SearchIcon className="text-gray-400" />
            <InputBase
              placeholder="Search..."
              className="ml-2"
              sx={{ color: 'inherit' }}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <Tooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton 
              onClick={toggleColorMode} 
              size="small"
              className="hover:rotate-180 transition-transform duration-300"
            >
              {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <IconButton 
            size="small"
            className="hover:rotate-12 transition-transform duration-200"
          >
            <LanguageIcon />
          </IconButton>

          <IconButton 
            size="small"
            className="hover:scale-110 transition-transform duration-200"
          >
            <Badge 
              badgeContent={4} 
              color="error"
              className="animate-pulse"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Tooltip title="Account settings">
            <IconButton 
              onClick={handleMenu} 
              size="small"
              className="hover:scale-110 transition-transform duration-200"
            >
              <Avatar sx={{ width: 32, height: 32 }} className="ring-2 ring-blue-500/20">
                JD
              </Avatar>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              className: 'mt-2 rounded-xl border shadow-lg',
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="inherit" noWrap>
                  admin@example.com
                </Typography>
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } flex-shrink-0 overflow-y-auto border-r transition-all duration-300 ease-in-out ${
            theme.palette.mode === 'dark' 
              ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-gradient-to-b from-white to-gray-50 border-gray-200'
          }`}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? theme.palette.mode === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm'
                    : theme.palette.mode === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:bg-gray-100/80'
                }`}
              >
                <span className={`${
                  !isSidebarOpen ? 'mx-auto' : 'mr-3'
                } transition-transform duration-200 ${
                  location.pathname === item.path ? 'scale-110' : ''
                }`}>
                  {item.icon}
                </span>
                {isSidebarOpen && (
                  <span className="font-medium">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
