import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchProducts, fetchSuppliers, createProduct } from "../../service/pharmacy";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    supplier_id: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    imagePreview: null,
  });

  const [data, setData] = useState([]);

  const openModal = (index = null) => {
    setError(null);
    setEditingIndex(index);
    if (index !== null) {
      setFormData({
        ...data[index],
        image: null,
        imagePreview: data[index].image || null,
      });
    } else {
      setFormData({
        name: "",
        supplier_id: "",
        description: "",
        price: "",
        stock: "",
        image: null,
        imagePreview: null,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIndex(null);
    setError(null);
    setFormData({
      name: "",
      supplier_id: "",
      description: "",
      price: "",
      stock: "",
      image: null,
      imagePreview: null,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      // Send as integer to satisfy Laravel 'integer' rule
      submitData.append("supplier_id", parseInt(formData.supplier_id, 10));
      submitData.append("description", formData.description || "");
      
      // Only append if values are not empty
      if (formData.price !== "") {
        submitData.append("price", parseFloat(formData.price));
      }
      if (formData.stock !== "") {
        submitData.append("stock", parseInt(formData.stock, 10));
      }
      if (formData.image) {
        // Include filename explicitly
        submitData.append("image", formData.image, formData.image.name);
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      if (editingIndex === null) {
        const response = await createProduct(submitData);
        console.log("Product created:", response.data);
        setData([...data, response.data.data]);
      } else {
        // TODO: Implement update product when API is ready
        setData([...data]);
      }
      closeModal();
    } catch (err) {
      console.error("Error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, suppliersRes] = await Promise.all([
          fetchProducts(),
          fetchSuppliers(),
        ]);
        setData(productsRes.data.data);
        setSuppliers(suppliersRes.data.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/medi-Image/MediBear-Main-Logo.png"
            alt="MediBear"
            className="h-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/pharmacy/dashboard"
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            Dashboard
          </Link>
          <Link
            to="/login"
            className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
          >
            Logout
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-screen-2xl mx-auto px-6 py-8 w-full">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-blue-900">Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage medicines — add, edit and search stock
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search medicine"
              className="border rounded px-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Add item
            </button>
          </div>
        </header>

        <section>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full" style={{ minWidth: "1100px" }}>
              <thead className="border-b">
                <tr>
                  <th className="text-left px-4 py-3">Medicine name</th>
                  <th className="text-left px-4 py-3">Supplier</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.supplier?.name || "N/A"}</td>
                    <td className="px-4 py-3">{row.stock || 0}</td>
                    <td className="px-4 py-3">৳ {row.price || 0}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openModal(idx)}
                        className="px-3 py-1 text-sm bg-yellow-50 text-yellow-800 rounded hover:bg-yellow-100"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-8">
          <div className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-xl">
            <header className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingIndex === null ? "Add medicine" : "Edit medicine"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </header>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medicine Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medicine name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter medicine name"
                  required
                  maxLength="255"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.supplier_id}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_id: e.target.value })
                  }
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter medicine description"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded px-4 py-6 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/jpg,image/jpeg,image/png,image/webp"
                    className="w-full"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, JPEG, PNG, WebP (Max 4MB)
                  </p>
                </div>
                {formData.imagePreview && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="max-w-xs max-h-32 rounded"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
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
                  {loading ? "Saving..." : editingIndex === null ? "Add Medicine" : "Update Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
