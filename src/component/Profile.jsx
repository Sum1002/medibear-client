import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  getUserDetails,
  createAddress,
  updateAddress,
  deleteAddress,
  addFavoritePharmacy,
  removeFavoritePharmacy,
} from "../service/http";
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    is_default: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserDetails();
      const data = res.data?.data || res.data || {};
      setUser(data.user || data);
      setAddresses(Array.isArray(data.addresses) ? data.addresses : []);
      setFavorites(
        Array.isArray(data.favorite_pharmacies) ? data.favorite_pharmacies : []
      );
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressFormChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetAddressForm = () => {
    setAddressForm({
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      is_default: false,
    });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      address_line_1: addr.address_line_1 || "",
      address_line_2: addr.address_line_2 || "",
      city: addr.city || "",
      state: addr.state || "",
      zip_code: addr.zip_code || "",
      country: addr.country || "",
      is_default: addr.is_default || false,
    });
    setShowAddressForm(true);
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    if (
      !addressForm.address_line_1 ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zip_code
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressForm);
        toast.success("Address updated");
      } else {
        await createAddress(addressForm);
        toast.success("Address created");
      }
      resetAddressForm();
      fetchUserDetails();
    } catch (err) {
      console.error("Error saving address:", err);
      const msg = err.response?.data?.message || "Failed to save address";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      fetchUserDetails();
    } catch (err) {
      console.error("Error deleting address:", err);
      const msg = err.response?.data?.message || "Failed to delete address";
      toast.error(msg);
    }
  };

  const handleRemoveFavorite = async (pharmacyId) => {
    try {
      await removeFavoritePharmacy(pharmacyId);
      toast.success("Removed from favorites");
      fetchUserDetails();
    } catch (err) {
      console.error("Error removing favorite:", err);
      const msg = err.response?.data?.message || "Failed to remove favorite";
      toast.error(msg);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-6 py-8">

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading profile...
            </div>
          ) : (
            <>
              {/* User Info */}
              <section className="bg-white rounded-lg shadow border border-gray-100 p-6 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {user?.name}
                    </h2>
                    <p className="text-sm text-gray-500">User ID: {user?.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {user?.email || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {user?.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {user?.register_as || "—"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Addresses Section */}
              <section className="bg-white rounded-lg shadow border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">
                    My Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddressForm((v) => !v)}
                    className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                  >
                    {showAddressForm ? "Cancel" : "Add Address"}
                  </button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <form
                    onSubmit={handleSubmitAddress}
                    className="bg-gray-50 rounded p-4 mb-6"
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {editingAddress ? "Edit Address" : "New Address"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={addressForm.address_line_1}
                          onChange={(e) =>
                            handleAddressFormChange(
                              "address_line_1",
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          value={addressForm.address_line_2}
                          onChange={(e) =>
                            handleAddressFormChange(
                              "address_line_2",
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Apt, suite, etc. (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) =>
                            handleAddressFormChange("city", e.target.value)
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) =>
                            handleAddressFormChange("state", e.target.value)
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={addressForm.zip_code}
                          onChange={(e) =>
                            handleAddressFormChange("zip_code", e.target.value)
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={addressForm.country}
                          onChange={(e) =>
                            handleAddressFormChange("country", e.target.value)
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={addressForm.is_default}
                          onChange={(e) =>
                            handleAddressFormChange(
                              "is_default",
                              e.target.checked
                            )
                          }
                        />
                        <span className="text-sm text-gray-700">
                          Set as default address
                        </span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`px-4 py-2 rounded text-sm text-white ${
                          submitting
                            ? "bg-blue-300"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {submitting
                          ? "Saving..."
                          : editingAddress
                          ? "Update"
                          : "Create"}
                      </button>
                      <button
                        type="button"
                        onClick={resetAddressForm}
                        className="px-4 py-2 rounded border text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Address List */}
                {addresses.length === 0 ? (
                  <p className="text-sm text-gray-500">No addresses yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`border rounded-lg p-4 ${
                          addr.is_default
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        {addr.is_default && (
                          <span className="inline-block px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold mb-2">
                            Default
                          </span>
                        )}
                        <p className="font-medium text-gray-900">
                          {addr.address_line_1}
                        </p>
                        {addr.address_line_2 && (
                          <p className="text-sm text-gray-600">
                            {addr.address_line_2}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.state} {addr.zip_code}
                        </p>
                        {addr.country && (
                          <p className="text-sm text-gray-600">
                            {addr.country}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditAddress(addr)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Favorite Pharmacies */}
              <section className="bg-white rounded-lg shadow border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-6">
                  Favorite Pharmacies
                </h2>
                {favorites.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No favorite pharmacies yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((fav) => (
                      <div
                        key={fav.id || fav.pharmacy_id}
                        onClick={() =>
                          navigate(
                            `/products?pharmacyId=${fav.id || fav.pharmacy_id}&pharmacyName=${encodeURIComponent(fav.name || "Pharmacy")}`
                          )
                        }
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {fav.name || "Pharmacy"}
                            </p>
                            {fav.phone && (
                              <p className="text-sm text-gray-600 mt-1">
                                {fav.phone}
                              </p>
                            )}
                            {fav.email && (
                              <p className="text-sm text-gray-500 mt-1">
                                {fav.email}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(fav.id || fav.pharmacy_id);
                            }}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Remove favorite"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
