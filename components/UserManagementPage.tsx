import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Edit2, Lock, Eye, Mail } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
  status: 'active' | 'inactive';
  joinDate: string;
}

interface UserManagementPageProps {
  onAddUser?: (user: TeamMember) => void;
  onDeleteUser?: (id: string) => void;
  onUpdateUser?: (user: TeamMember) => void;
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({
  onAddUser,
  onDeleteUser,
  onUpdateUser,
}) => {
  const [users, setUsers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@metalex.com',
      role: 'SUPER_ADMIN',
      status: 'active',
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@metalex.com',
      role: 'ADMIN',
      status: 'active',
      joinDate: '2024-06-20',
    },
    {
      id: '3',
      name: 'Sarah Smith',
      email: 'sarah@metalex.com',
      role: 'STAFF',
      status: 'active',
      joinDate: '2024-08-10',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STAFF' as const,
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: TeamMember = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    onAddUser?.(newUser);
    setFormData({ name: '', email: '', role: 'STAFF' });
    setShowForm(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
      onDeleteUser?.(id);
    }
  };

  const handleUpdateRole = (id: string, newRole: TeamMember['role']) => {
    const updatedUsers = users.map((u) => (u.id === id ? { ...u, role: newRole } : u));
    setUsers(updatedUsers);
    const user = updatedUsers.find((u) => u.id === id);
    if (user) onUpdateUser?.(user);
  };

  const getRoleBadgeColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'STAFF':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-600" />
            Team Management
          </h1>
          <p className="text-slate-600 mt-1">Manage your team members and their permissions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2 transition"
        >
          <UserPlus className="w-5 h-5" />
          Add Team Member
        </button>
      </div>

      {/* Add User Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as TeamMember['role'],
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                Add User
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-semibold hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleUpdateRole(user.id, e.target.value as TeamMember['role'])
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getRoleBadgeColor(user.role)}`}
                    >
                      <option value="STAFF">Staff</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-900 transition"
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

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-2">Total Members</h3>
          <p className="text-3xl font-black text-orange-600">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-2">Active Users</h3>
          <p className="text-3xl font-black text-green-600">{users.filter((u) => u.status === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-2">Admins</h3>
          <p className="text-3xl font-black text-blue-600">{users.filter((u) => u.role !== 'STAFF').length}</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
