import React, { useEffect, useState } from "react";
import { fetchProducts, fetchSuppliers, createProduct, updateProduct, deleteProduct } from "../../service/pharmacy";
import PharmacyOwnerNav from "./PharmacyOwnerNav";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      submitData.append("supplier_id", parseInt(formData.supplier_id, 10));
      submitData.append("description", formData.description || "");
      
      if (formData.price !== "") {
        submitData.append("price", parseFloat(formData.price));
      }
      if (formData.stock !== "") {
        submitData.append("stock", parseInt(formData.stock, 10));
      }
      if (formData.image) {
        submitData.append("image", formData.image, formData.image.name);
      }

      console.log("FormData contents:");
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      if (editingIndex === null) {
        const response = await createProduct(submitData);
        console.log("Product created:", response.data);
        setData([...data, response.data.data]);
      } else {
        const productId = data[editingIndex].id;
        const response = await updateProduct(productId, submitData);
        console.log("Product updated:", response.data);
        const updatedData = [...data];
        updatedData[editingIndex] = response.data.data;
        setData(updatedData);
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

  const handleDelete = async (index) => {
    const productId = data[index]?.id;
    if (!productId) return;
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);
    try {
      await deleteProduct(productId);
      setData(data.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to delete product");
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
      <PharmacyOwnerNav showName/>

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
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/20 transition-opacity duration-300"
            onClick={closeModal}
          />
          
          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b bg-white shrink-0">
              <h3 className="text-lg font-semibold">
                {editingIndex === null ? "Add Product" : "Edit Product"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </header>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
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
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between"
                  >
                    <span>
                      {formData.supplier_id
                        ? suppliers.find((s) => s.id === parseInt(formData.supplier_id, 10))?.name
                        : "Select a supplier"}
                    </span>
                    <span className="text-gray-500">▼</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="border border-gray-300 border-t-0 rounded-b bg-white shadow-lg max-h-48 overflow-y-auto">
                      {suppliers.map((supplier) => (
                        <button
                          key={supplier.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, supplier_id: supplier.id.toString() });
                            setDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-blue-50 text-gray-700 border-b last:border-b-0"
                        >
                          {supplier.name}
                        </button>
                      ))}
                    </div>
                  )}
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
                    {loading ? "Saving..." : editingIndex === null ? "Add Medicine" : "Update Medicine"}
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

export default Inventory;
