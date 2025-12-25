import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { adminAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Users, DollarSign, Tag, TrendingUp, Trash2, Shield, UserPlus, UsersIcon, Crown, CreditCard, Wallet, ArrowRight, Ban, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import UserGroups from '../components/UserGroups'

function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Only ROLE_ADMIN and ROLE_OWNER can access
  if (user?.role !== 'ROLE_ADMIN' && user?.role !== 'ROLE_OWNER') {
    return <Navigate to="/dashboard" replace />
  }
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalCategories: 0
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users') // 'users' or 'groups'
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getSystemStats(),
        adminAPI.getAllUsers()
      ])
      console.log('Admin Stats Response:', statsRes.data)
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await adminAPI.deleteUser(userId)
      toast.success('User deleted successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error.response?.data || 'Failed to delete user')
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    
    try {
      await adminAPI.createAdminUser(adminForm)
      toast.success('Admin user created successfully')
      setShowCreateAdmin(false)
      setAdminForm({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      })
      fetchDashboardData()
    } catch (error) {
      console.error('Error creating admin:', error)
      toast.error(error.response?.data || 'Failed to create admin user')
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole)
      toast.success('User role updated successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Failed to update user role')
    }
  }

  const handlePromoteToAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to promote this user to admin? They will be able to create and manage their own users.')) {
      return
    }

    try {
      await adminAPI.promoteUserToAdmin(userId)
      toast.success('User promoted to admin successfully')
      fetchDashboardData()
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error(error.response?.data?.error || 'Failed to promote user')
    }
  }

  const handleBlockUser = async (userId, isBlocked) => {
    const action = isBlocked ? 'unblock' : 'block'
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return
    }

    try {
      if (isBlocked) {
        await adminAPI.unblockUser(userId)
        toast.success('User unblocked successfully')
      } else {
        await adminAPI.blockUser(userId)
        toast.success('User blocked successfully')
      }
      fetchDashboardData()
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
      toast.error(error.response?.data?.error || `Failed to ${action} user`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setShowCreateAdmin(!showCreateAdmin)}
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Create Admin User
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'groups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UsersIcon className="w-4 h-4 inline mr-2" />
            User Groups
          </button>
        </nav>
      </div>

      {activeTab === 'users' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Admin Form */}
      {showCreateAdmin && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Create New Admin User</h2>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={adminForm.username}
                  onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={adminForm.firstName}
                  onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={adminForm.lastName}
                  onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Create Admin</button>
              <button
                type="button"
                onClick={() => setShowCreateAdmin(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-sm text-gray-500">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.groupName ? (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                        {u.groupName}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">No Group</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                      disabled={u.id === user.id}
                    >
                      <option value="ROLE_USER">User</option>
                      <option value="ROLE_ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {u.role === 'ROLE_USER' ? (
                      u.blocked ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {u.role === 'ROLE_ADMIN' ? 'Admin' : 'Owner'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {user?.role === 'ROLE_OWNER' && u.role === 'ROLE_USER' && (
                        <button
                          onClick={() => handlePromoteToAdmin(u.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Promote to Admin"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                      )}
                      {u.role === 'ROLE_USER' && (
                        <button
                          onClick={() => handleBlockUser(u.id, u.blocked)}
                          className={`flex items-center gap-1 ${u.blocked ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                          title={u.blocked ? 'Unblock User' : 'Block User'}
                          disabled={u.id === user.id}
                        >
                          {u.blocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === user.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {activeTab === 'groups' && (
        <UserGroups />
      )}
    </div>
  )
}

export default AdminDashboard

