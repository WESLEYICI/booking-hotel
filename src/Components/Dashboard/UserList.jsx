import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const UserList = () => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await api.put(`/users/${id}`, updatedData);
      setUsers(users.map((user) => (user.id === id ? res.data : user)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-hotel-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-hotel-charcoal/40 text-sm">Loading users...</p>
        </div>
      </div>
    );

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (id) => {
    handleUpdate(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-hotel-primary">User Management</h2>
          <p className="text-hotel-charcoal/40 text-sm mt-1">{users.length} users registered</p>
        </div>
      </div>

      <div className="table-premium bg-white rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Role</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-hotel-accent/[0.02] transition-colors">
                  <td className="font-medium text-hotel-primary">#{user.id}</td>
                  <td>
                    {editingId === user.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        className="input-premium text-sm py-1.5 px-3"
                      />
                    ) : (
                      <span className="text-hotel-charcoal/70">{user.name}</span>
                    )}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleChange}
                        className="input-premium text-sm py-1.5 px-3"
                      />
                    ) : (
                      <span className="text-hotel-charcoal/70">{user.email}</span>
                    )}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleChange}
                        className="input-premium text-sm py-1.5 px-3"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-success'}`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit(user.id)}
                          className="px-3 py-1.5 rounded-lg bg-hotel-success text-white text-xs font-medium hover:bg-green-600 transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1.5 rounded-lg bg-hotel-accent/10 text-hotel-accent text-xs font-medium hover:bg-hotel-accent/20 transition-all"
                        >
                          Edit
                        </button>
                        {user?.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-hotel-danger text-xs font-medium hover:bg-red-100 transition-all"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
