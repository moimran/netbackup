import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Devices from './pages/Devices'
import BackupHistory from './pages/BackupHistory'
import { ThemeProviderWrapper } from './theme/ThemeContext'

function App() {
  return (
    <ThemeProviderWrapper>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/backup-history" element={<BackupHistory />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProviderWrapper>
  )
}

export default App
