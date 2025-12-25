import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  Users, 
  Shield, 
  UserPlus, 
  TrendingUp, 
  Activity,
  Crown,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Mail,
  Send
} from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  
  // Only ROLE_OWNER can access
  if (user?.role !== 'ROLE_OWNER') {
    return <Navigate to="/dashboard" replace />;
  }
  
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalAdmins: 0,
    totalUsers: 0,
    totalTransactions: 0
  });
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    fetchUsersAndAdmins();
    fetchSystemStats();
  }, []);

  const changeRole = async (userId, currentRole, username) => {
    const targetRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    const action = currentRole === 'ROLE_ADMIN' ? 'demote to User' : 'promote to Admin';
    
    if (!window.confirm(`Are you sure you want to ${action} "${username}"?`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/change-role`, { role: targetRole });
      setSuccess(`Successfully ${action === 'demote to User' ? 'demoted' : 'promoted'} ${username}`);
      fetchUsersAndAdmins(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action}`);
      setTimeout(() => setError(''), 5000);
    }
  };

  const fetchUsersAndAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users-with-groups');
      setUsers(response.data);
      
      // Calculate stats from the data
      const adminsCount = response.data.filter(u => u.role === 'ROLE_ADMIN').length;
      const usersCount = response.data.filter(u => u.role === 'ROLE_USER').length;
      
      setSystemStats(prev => ({
        ...prev,
        totalAdmins: adminsCount,
        totalUsers: usersCount
      }));
    } catch (err) {
      setError('Failed to fetch users and admins');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      // Fetch all transactions to count them
      const response = await api.get('/admin/transactions');
      const transactions = response.data || [];
      
      setSystemStats(prev => ({
        ...prev,
        totalTransactions: transactions.length
      }));
    } catch (err) {
      console.error('Failed to fetch system stats:', err);
      // Keep existing stats on error
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // await api.post('/owner/admins', newAdmin);
      
      setSuccess('Admin created successfully!');
      setShowAddAdmin(false);
      setNewAdmin({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleToggleAdminStatus = async (adminId, currentStatus) => {
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // await api.patch(`/owner/admins/${adminId}/status`, { isActive: !currentStatus });
      
      setSuccess(`Admin ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchAdmins();
    } catch (err) {
      setError('Failed to update admin status');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin? This will also remove all their users.')) {
      return;
    }

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // await api.delete(`/owner/admins/${adminId}`);
      
      setSuccess('Admin deleted successfully');
      fetchAdmins();
    } catch (err) {
      setError('Failed to delete admin');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      setError('Please select at least one recipient');
      return;
    }

    try {
      const response = await api.post('/admin/send-email', {
        recipientIds: selectedUsers,
        subject: emailData.subject,
        message: emailData.message
      });
      
      setSuccess(`Email sent successfully to ${response.data.sentCount} registered email address(es)`);
      setShowEmailComposer(false);
      setSelectedUsers([]);
      setEmailData({ subject: '', message: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send emails');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-10 h-10 text-amber-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              System Owner Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-13">
            Welcome back, <span className="font-semibold text-amber-700">{user?.username}</span>
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Admins</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{systemStats.totalAdmins}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{systemStats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Transactions</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{systemStats.totalTransactions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users and Admins Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              All Users & Admins
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailComposer(!showEmailComposer)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </button>
              <button
                onClick={() => setShowAddAdmin(!showAddAdmin)}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
              >
                <UserPlus className="w-5 h-5" />
                Add New Admin
              </button>
            </div>
          </div>

          {/* Add Admin Form */}
          {showAddAdmin && (
            <div className="mb-6 bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Admin</h3>
              <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmin.firstName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmin.lastName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter password"
                    minLength="6"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Create Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAdmin(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Email Composer */}
          {showEmailComposer && (
            <div className="mb-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Send Email to Members
              </h3>
              <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
                <p className="text-sm text-blue-800">
                  📧 <strong>Security Notice:</strong> Emails will be sent to registered email addresses only.
                  Selected: <strong>{selectedUsers.length}</strong> recipient(s)
                </p>
              </div>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows="6"
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your message..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={selectedUsers.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Send to {selectedUsers.length} recipient(s)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailComposer(false);
                      setEmailData({ subject: '', message: '' });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users and Admins List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users and admins...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              user.role === 'ROLE_ADMIN' ? 'bg-purple-100' : 'bg-blue-100'
                            }`}>
                              {user.role === 'ROLE_ADMIN' ? (
                                <Shield className="w-6 h-6 text-purple-600" />
                              ) : (
                                <Users className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ROLE_ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.adminUsername || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => changeRole(user.id, user.role, user.username)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                            user.role === 'ROLE_ADMIN'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                          title={user.role === 'ROLE_ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          {user.role === 'ROLE_ADMIN' ? (
                            <>
                              <Users className="w-4 h-4" />
                              Make User
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              Make Admin
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
