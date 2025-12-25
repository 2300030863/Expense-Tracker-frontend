import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { UserPlus, Users, Wallet, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function UserGroups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupUsers, setGroupUsers] = useState([]);
  const [userAccounts, setUserAccounts] = useState({}); // Store accounts by userId
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    groupId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
    fetchAllUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserGroups();
      setGroups(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load user groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setAllUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const fetchGroupUsers = async (groupId) => {
    try {
      const response = await adminAPI.getUsersInGroup(groupId);
      setGroupUsers(response.data);
      setSelectedGroup(groupId);
      
      // Fetch accounts for each user
      const accountsData = {};
      for (const user of response.data) {
        try {
          const accountsResponse = await adminAPI.getUserAccounts(user.id);
          accountsData[user.id] = accountsResponse.data;
        } catch (err) {
          console.error(`Failed to load accounts for user ${user.id}:`, err);
          accountsData[user.id] = [];
        }
      }
      setUserAccounts(accountsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load group users');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await adminAPI.createUserGroup(formData);
      setGroups([...groups, response.data]);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      setError('');
      toast.success('Group created successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = {
        username: userFormData.username,
        email: userFormData.email,
        password: userFormData.password,
        firstName: userFormData.firstName,
        lastName: userFormData.lastName
      };
      
      const response = await adminAPI.createUser(userData);
      const newUser = response.data;
      
      // If a group is selected, assign the user to that group
      if (userFormData.groupId) {
        await adminAPI.assignUserToGroup(newUser.id, userFormData.groupId);
        // Refresh group users if viewing that group
        if (selectedGroup === parseInt(userFormData.groupId)) {
          fetchGroupUsers(selectedGroup);
        }
      }
      
      setUserFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        groupId: ''
      });
      setShowCreateUserForm(false);
      setError('');
      fetchAllUsers();
      toast.success('User created successfully' + (userFormData.groupId ? ' and added to group' : ''));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
      toast.error(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToGroup = async (userId, groupId) => {
    try {
      await adminAPI.assignUserToGroup(userId, groupId);
      toast.success('User assigned to group');
      if (selectedGroup === groupId) {
        fetchGroupUsers(groupId);
      }
    } catch (err) {
      toast.error('Failed to assign user to group');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Groups</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowCreateUserForm(!showCreateUserForm);
              setShowCreateForm(false);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <UserPlus size={18} />
            {showCreateUserForm ? 'Cancel' : 'Create User'}
          </button>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setShowCreateUserForm(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Users size={18} />
            {showCreateForm ? 'Cancel' : 'Create Group'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showCreateUserForm && (
        <form onSubmit={handleCreateUser} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                value={userFormData.username}
                onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                value={userFormData.firstName}
                onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                value={userFormData.lastName}
                onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Assign to Group (Optional)</label>
              <select
                value={userFormData.groupId}
                onChange={(e) => setUserFormData({ ...userFormData, groupId: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- No Group --</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateGroup} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Group Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Groups List</h3>
          {loading && <p className="text-gray-500">Loading...</p>}
          {!loading && groups.length === 0 && (
            <p className="text-gray-500">No groups created yet.</p>
          )}
          <div className="space-y-2">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => fetchGroupUsers(group.id)}
                className={`p-4 border rounded cursor-pointer transition ${
                  selectedGroup === group.id
                    ? 'bg-blue-50 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <h4 className="font-semibold">{group.name}</h4>
                {group.description && (
                  <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Group Members</h3>
          {!selectedGroup && (
            <p className="text-gray-500">Select a group to view members</p>
          )}
          {selectedGroup && (
            <>
              {groupUsers.length === 0 && (
                <div>
                  <p className="text-gray-500 mb-4">No users in this group</p>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-sm">Add Existing Users:</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {allUsers
                        .filter(user => !groupUsers.find(gu => gu.id === user.id))
                        .filter(user => user.role === 'ROLE_USER')
                        .map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium">{user.username}</p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                            <button
                              onClick={() => handleAssignToGroup(user.id, selectedGroup)}
                              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              {groupUsers.length > 0 && (
                <>
                  <div className="space-y-2 mb-4">
                    {groupUsers.map((user) => {
                      const accounts = userAccounts[user.id] || [];
                      const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
                      
                      return (
                        <div key={user.id} className="p-3 border rounded bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold">{user.username}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-2">
                                <div className="text-xs text-gray-500">
                                  {user.firstName} {user.lastName}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-sm">Add More Users:</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allUsers
                        .filter(user => !groupUsers.find(gu => gu.id === user.id))
                        .filter(user => user.role === 'ROLE_USER')
                        .map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium">{user.username}</p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                            <button
                              onClick={() => handleAssignToGroup(user.id, selectedGroup)}
                              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      {allUsers.filter(user => !groupUsers.find(gu => gu.id === user.id) && user.role === 'ROLE_USER').length === 0 && (
                        <p className="text-sm text-gray-500">No more users available to add</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserGroups;
