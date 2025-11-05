import * as React from 'react'
import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// --- CÁC COMPONENT TĨNH ---
import Login from './Pages/Login'

const Help = React.lazy(() => import('./pages/Help'))
const About = React.lazy(() => import('./pages/About'))

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Đang tải trang...
  </div>
)

export default function App() {
  return (
    <Router>
      {/* Bọc toàn bộ <Routes> bằng <Suspense> và cung cấp fallback */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Route này không lazy, sẽ tải ngay lập tức */}
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<Login />} />

          <Route />
        </Routes>
      </Suspense>
    </Router>
  )
}