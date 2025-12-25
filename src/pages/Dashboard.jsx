import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { analyticsAPI } from '../services/api'
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Shield, User as UserIcon, Crown } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency as formatCurrencyUtil, getCurrencySymbol } from '../utils/currency'
import CountrySelectionModal from '../components/CountrySelectionModal'

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCountryModal, setShowCountryModal] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  })
  
  const isOwner = user?.role === 'ROLE_OWNER'
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const isUser = user?.role === 'ROLE_USER'
  const isGroupMember = user?.isGroupMember

  useEffect(() => {
    fetchDashboardData()
    // Show country selection modal if user doesn't have country set and is not a group member
    if (user && !user.country && !isGroupMember) {
      setShowCountryModal(true)
    }
  }, [dateRange, user, isGroupMember])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const params = {
        startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
        endDate: format(dateRange.endDate, 'yyyy-MM-dd')
      }
      
      const response = await analyticsAPI.getDashboard(params)
      setDashboardData(response.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    const userCountry = user?.country || 'India'
    return formatCurrencyUtil(amount, userCountry)
  }

  const formatCategoryData = (categorySpending) => {
    return categorySpending?.map((item, index) => ({
      name: item[0],
      value: parseFloat(item[1]),
      color: COLORS[index % COLORS.length]
    })) || []
  }

  const formatTrendData = (monthlyTrend) => {
    return monthlyTrend?.map(item => ({
      month: item[0],
      amount: parseFloat(item[1])
    })) || []
  }

  const handleCountrySelected = (country) => {
    // Update user context with new country
    window.location.reload() // Reload to refresh user data from backend
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Country Selection Modal */}
      <CountrySelectionModal 
        isOpen={showCountryModal}
        onClose={() => setShowCountryModal(false)}
        onCountrySelected={handleCountrySelected}
        userProfile={user}
      />

      {/* User Role Banner */}
      <div className={`rounded-lg p-4 sm:p-6 ${
        isOwner ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600' :
        isAdmin ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 
        'bg-gradient-to-r from-blue-600 to-blue-700'
      } text-white shadow-lg`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${
              isOwner ? 'bg-amber-700' :
              isAdmin ? 'bg-purple-800' : 
              'bg-blue-800'
            } bg-opacity-50`}>
              {isOwner ? (
                <Crown className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : isAdmin ? (
                <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
              ) : (
                <UserIcon className="w-6 h-6 sm:w-8 sm:h-8" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold truncate">
                Welcome, {user?.firstName || user?.username}!
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-1 sm:gap-2">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold inline-block w-fit ${
                  isOwner ? 'bg-amber-700' :
                  isAdmin ? 'bg-purple-800' : 
                  'bg-blue-800'
                } bg-opacity-50`}>
                  {isOwner ? '👑 Owner' : isAdmin ? '🛡️ Administrator' : '👤 User'}
                </span>
                <span className={`text-xs sm:text-sm truncate ${isOwner ? 'text-amber-100' : isAdmin ? 'text-purple-100' : 'text-blue-100'}`}>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
          {(isOwner || isAdmin) && (
            <div className="text-left sm:text-right">
              <p className={`text-xs sm:text-sm ${isOwner ? 'text-amber-100' : 'text-purple-100'}`}>Account Type</p>
              <p className="text-base sm:text-xl font-bold">
                {isOwner ? 'System Owner Access' : 'Admin Dashboard Access'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Role Request Message for Regular Users (not group members) */}
      {isUser && !user?.isGroupMember && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900 mb-1">
                Want Admin Access?
              </h3>
              <p className="text-sm text-amber-800">
                If you would like to request administrator privileges,{' '}
                <a 
                  href={`mailto:experiencetracker52@gmail.com?subject=Admin Access Request&body=Hello,%0D%0A%0D%0AI would like to request administrator privileges for my account.%0D%0A%0D%0AUser Details:%0D%0AName: ${user?.name || 'N/A'}%0D%0AEmail: ${user?.email || 'N/A'}%0D%0A%0D%0AThank you.`}
                  className="font-semibold text-amber-900 hover:text-amber-700 underline"
                >
                  click here to contact the system owner
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Financial Overview</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            value={format(dateRange.startDate, 'yyyy-MM-dd')}
            onChange={(e) => setDateRange({ ...dateRange, startDate: new Date(e.target.value) })}
            className="input-field text-sm"
          />
          <input
            type="date"
            value={format(dateRange.endDate, 'yyyy-MM-dd')}
            onChange={(e) => setDateRange({ ...dateRange, endDate: new Date(e.target.value) })}
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData?.totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData?.totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${(dashboardData?.netAmount || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign className={`w-6 h-6 ${(dashboardData?.netAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Amount</p>
              <p className={`text-2xl font-bold ${(dashboardData?.netAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(dashboardData?.netAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          {dashboardData?.categorySpending?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatCategoryData(dashboardData.categorySpending)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {formatCategoryData(dashboardData.categorySpending).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No expense data available for the selected period
            </div>
          )}
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
          {dashboardData?.monthlyTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatTrendData(dashboardData.monthlyTrend)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No trend data available for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/app/transactions')} className="btn-primary">
            Add New Transaction
          </button>
          <button onClick={() => navigate('/app/transactions')} className="btn-secondary">
            View All Transactions
          </button>
          <button onClick={() => navigate('/app/budgets')} className="btn-secondary">
            Set Budget
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard



