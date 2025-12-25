import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import RecurringTransactions from './pages/RecurringTransactions'
import Categories from './pages/Categories'
import Accounts from './pages/Accounts'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import OwnerDashboard from './pages/OwnerDashboard'

function ProtectedRoute({ children, adminOnly = false, ownerOnly = false }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  // Owner-only route protection
  if (ownerOnly && user.role !== 'ROLE_OWNER') {
    return <Navigate to="/app/dashboard" />
  }
  
  // Admin-only route protection (Owner can also access)
  if (adminOnly && user.role !== 'ROLE_ADMIN' && user.role !== 'ROLE_OWNER') {
    return <Navigate to="/app/dashboard" />
  }
  
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  return user ? <Navigate to="/app/dashboard" /> : children
}

function App() {
  console.log('App component rendering...')
  
  // Use root path - vite.config.js sets base: '/' for all builds
  const basename = '/'
  
  console.log('Router basename:', basename)
  
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } />
              <Route path="/reset-password" element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              } />
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/app/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="recurring-transactions" element={<RecurringTransactions />} />
                <Route path="categories" element={<Categories />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="owner" element={<OwnerDashboard />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App

