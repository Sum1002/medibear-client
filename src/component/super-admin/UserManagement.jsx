import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { getAllUsers, updateUserStatus } from "../../service/http";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, status) => {
    setProcessing(userId);
    try {
      await updateUserStatus(userId, status);
      toast.success(`User ${status} successfully`);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user status:", err);
      toast.error("Failed to update user status");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600";
      case "suspended":
        return "text-yellow-600";
      case "blocked":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRoleBadge = (role) => {
    if (role === "pharmacy") {
      return "bg-purple-100 text-purple-800";
    } else if (role === "admin") {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="bg-linear-to-r from-blue-50 to-white font-sans min-h-screen flex flex-col">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto p-8 grow flex flex-col">
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-md">
            User Management
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-linear-to-r from-blue-950 to-blue-700 text-white font-semibold rounded-lg px-6 py-3 shadow-lg hover:shadow-xl transition duration-300"
          >
            Back to Dashboard
          </button>
        </header>

        <section className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col overflow-auto max-h-[70vh]">
          <p className="mb-8 text-gray-700 text-lg tracking-wide">
            Manage user accounts: suspend, block, or review user details.
          </p>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="space-y-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between p-5 rounded-xl border border-blue-300 hover:shadow-lg bg-blue-50 transition duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-semibold text-blue-900">
                        {user.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
                          user.register_as || "customer"
                        )}`}
                      >
                        {user.register_as === "pharmacy"
                          ? "Pharmacy"
                          : "Customer"}
                      </span>
                    </div>
                    <p className="text-blue-700">Email: {user.email}</p>
                    <p className="text-blue-700">
                      Phone: {user.phone || "N/A"}
                    </p>
                    <p
                      className={`font-semibold ${getStatusColor(user.status)}`}
                    >
                      Status: {user.status || "Active"}
                    </p>
                    {user.created_at && (
                      <p className="text-sm text-blue-600 mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-4 items-center">
                    {user.status !== "suspended" && (
                      <button
                        onClick={() => handleStatusChange(user.id, "suspended")}
                        disabled={processing === user.id}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-full px-5 py-2 shadow-md transition disabled:opacity-50"
                      >
                        {processing === user.id ? "Processing..." : "Suspend"}
                      </button>
                    )}
                    {user.status !== "blocked" && (
                      <button
                        onClick={() => handleStatusChange(user.id, "blocked")}
                        disabled={processing === user.id}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-5 py-2 shadow-md transition disabled:opacity-50"
                      >
                        Block
                      </button>
                    )}
                    {(user.status === "suspended" ||
                      user.status === "blocked") && (
                      <button
                        onClick={() => handleStatusChange(user.id, "active")}
                        disabled={processing === user.id}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-5 py-2 shadow-md transition disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserManagement;
