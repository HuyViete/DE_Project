import * as React from 'react'
import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/useAuthStore'

// --- CÁC COMPONENT TĨNH ---
import Login from './Pages/Login'
import ProtectedRoute from './Components/auth/ProtectedRoute'
import Notification from './Pages/notification'
import AuditLog from './Pages/AuditLog'

const Help = React.lazy(() => import('./pages/Help'))
const About = React.lazy(() => import('./pages/About'))
const Signup = React.lazy(() => import('./Pages/Signup'))

const Dashboard = React.lazy(() => import('./Pages/Dashboard'))
const Realtime = React.lazy(() => import('./Pages/realtime'))
const WarehouseSetup = React.lazy(() => import('./Pages/WarehouseSetup'))

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Đang tải trang...
  </div>
)

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          <Route path='/help' element={<Help />} />
          <Route path='/about' element={<About />} />

          <Route element={<ProtectedRoute/>}>
            <Route path='/setup-warehouse' element={<WarehouseSetup />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/realtime' element={<Realtime />} />
            <Route path='/notification' element={<Notification />} />
            <Route path='/auditlog' element={<AuditLog />} />
          </Route>

        </Routes>
      </Suspense>
    </Router>
  )
}