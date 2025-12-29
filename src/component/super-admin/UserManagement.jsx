import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { getAllUsers, updateUserStatus } from "../../service/http";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [offset]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const resp = await getAllUsers({ limit, offset });
      const data = Array.isArray(resp.data.data) ? resp.data.data : [];
      setUsers(data);
      setTotal(Number(resp.data.total || 0));
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = async (user, desiredValue) => {
    // desiredValue: 1 (active) or 0 (inactive) OR boolean
    const newStatusBoolean = desiredValue === 1 || desiredValue === '1' || desiredValue === true;
    setProcessingId(user.id);
    try {
      await updateUserStatus(user.id, newStatusBoolean);
      toast.success(`User status updated`);
      // Refresh list and selected user
      await fetchUsers();
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, status: newStatusBoolean ? 1 : 0 });
      }
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update user status");
    } finally {
      setProcessingId(null);
    }
  };

  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-50 to-white font-sans">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">User Management</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Joined</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{u.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{u.name || '—'}</div>
                        <div className="text-xs text-gray-500">{u.phone || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.register_as === 'pharmacy' ? 'bg-purple-100 text-purple-800' : u.register_as === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {u.register_as || 'customer'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {Number(u.status) === 1 ? (
                          <span className="text-green-700 font-semibold">Active</span>
                        ) : (
                          <span className="text-gray-600">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openDetails(u)}
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {Math.min(offset + 1, total || 0)} - {Math.min(offset + limit, total || 0)} of {total} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={!canPrev}
                className="px-3 py-1 bg-white border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={!canNext}
                className="px-3 py-1 bg-white border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
          <div className="relative w-full md:w-2/5 bg-white h-full shadow-xl p-6 overflow-auto transform transition-transform duration-200">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">User Details</h2>
              <button onClick={closeDrawer} className="text-gray-600 hover:text-gray-800">Close</button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedUser.name || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedUser.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{selectedUser.register_as || 'customer'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Addresses</p>
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {selectedUser.addresses.map((a) => (
                      <li key={a.id} className="p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {a.address_line_1}{a.address_line_2 ? `, ${a.address_line_2}` : ''}
                          </div>
                          {a.is_default && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {a.city}{a.state ? `, ${a.state}` : ''}{a.zip_code ? ` ${a.zip_code}` : ''} — {a.country}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No addresses</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Favorite Pharmacies</p>
                {selectedUser.favoritePharmacies && selectedUser.favoritePharmacies.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {selectedUser.favoritePharmacies.map((f) => (
                      <li key={f.id} className="text-sm">{f.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No favorites</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Account Status</p>
                <div className="mt-2">
                  <select
                    value={selectedUser.status === 1 || selectedUser.status === '1' || selectedUser.status === true ? 1 : 0}
                    onChange={(e) => setSelectedUser({ ...selectedUser, status: Number(e.target.value) })}
                    className="border rounded px-3 py-2"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>

                  <div className="mt-3">
                    <button
                      onClick={() => handleToggleStatus(selectedUser, selectedUser.status)}
                      disabled={processingId === selectedUser.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      {processingId === selectedUser.id ? 'Updating...' : 'Save Status'}
                    </button>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    export default UserManagement;
