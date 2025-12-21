import React, { useEffect, useState } from "react";
import PharmacyOwnerNav from "./PharmacyOwnerNav";
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../service/http";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const openModal = (index = null) => {
    setError(null);
    setEditingIndex(index);
    if (index !== null) {
      setFormData({
        name: suppliers[index].name || "",
        address: suppliers[index].address || "",
      });
    } else {
      setFormData({ name: "", address: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIndex(null);
    setError(null);
    setFormData({ name: "", address: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingIndex === null) {
        const res = await createSupplier({ ...formData });
        setSuppliers([...suppliers, res.data.data]);
      } else {
        const id = suppliers[editingIndex].id;
        const res = await updateSupplier(id, { ...formData });
        const next = [...suppliers];
        next[editingIndex] = res.data.data;
        setSuppliers(next);
      }
      closeModal();
    } catch (err) {
      console.error("Supplier save error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to save supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const supplier = suppliers[index];
    if (!supplier?.id) return;
    const confirmed = window.confirm("Delete this supplier?");
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      await deleteSupplier(supplier.id);
      setSuppliers(suppliers.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Delete supplier error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to delete supplier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSuppliers();
        setSuppliers(res.data.data);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        setError("Failed to load suppliers");
      }
    };
    load();
  }, []);

  const filtered = suppliers.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      s.name?.toLowerCase().includes(term) ||
      s.address?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <PharmacyOwnerNav showName />

      <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-8 w-full">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-blue-900">Suppliers</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage supplier directory — add, edit, remove
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search by name or address"
              className="border rounded px-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Add supplier
            </button>
          </div>
        </header>

        <section>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full" style={{ minWidth: "900px" }}>
              <thead className="border-b">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Address</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((supplier, idx) => (
                  <tr key={supplier.id || idx}>
                    <td className="px-4 py-3">{supplier.name}</td>
                    <td className="px-4 py-3">{supplier.address}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(idx)}
                          className="px-3 py-1 text-sm bg-yellow-50 text-yellow-800 rounded hover:bg-yellow-100"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-gray-500"
                      colSpan={3}
                    >
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/20 transition-opacity duration-300"
            onClick={closeModal}
          />
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
            <header className="flex items-center justify-between p-6 border-b bg-white shrink-0">
              <h3 className="text-lg font-semibold">
                {editingIndex === null ? "Add Supplier" : "Edit Supplier"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Supplier name"
                    required
                    maxLength="255"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Supplier address"
                    rows="3"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingIndex === null
                      ? "Add"
                      : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
