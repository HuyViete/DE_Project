import * as React from 'react'
import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// --- CÁC COMPONENT TĨNH ---
import Login from './Pages/Login'

const Help = React.lazy(() => import('./pages/Help'))
const About = React.lazy(() => import('./pages/About'))
const Signup = React.lazy(() => import('./Pages/Signup'))

const EngineerDashboard = React.lazy(() => import('./Pages/Engineer/Dashboard'))
const ManagerDashboard = React.lazy(() => import('./Pages/Manager/Dashboard'))

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Đang tải trang...
  </div>
)

const getUserRole = () => {

  return 'engineer'
}

const DashboardWrapper = () => {
  const role = getUserRole()

  if (role == 'engineer') return <EngineerDashboard />
  if (role == 'manager') return <ManagerDashboard />
  return
}

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

          <Route path='/dashboard' element={<DashboardWrapper />} />

        </Routes>
      </Suspense>
    </Router>
  )
}