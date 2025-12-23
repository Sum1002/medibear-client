import { useEffect, useState } from "react";
import PharmacyOwnerNav from "./PharmacyOwnerNav";
import toast, { Toaster } from "react-hot-toast";
import {
  getPharmacyProfile,
  updatePharmacyProfile,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserDetails,
  updateUserProfile,
} from "../../service/http";

export default function PharmacyProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    google_map_link: "",
  });
  const [addressForm, setAddressForm] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    is_default: false,
  });

  useEffect(() => {
    fetchPharmacyProfile();
  }, []);

  const fetchPharmacyProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserDetails();
      const data = res.data?.data || res.data || {};
      setPharmacy(data.user || data);
      setAddresses(Array.isArray(data.addresses) ? data.addresses : []);
    } catch (err) {
      console.error("Error fetching pharmacy profile:", err);
      setError("Failed to load pharmacy profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setProfileForm({
      name: pharmacy?.name || "",
      email: pharmacy?.email || "",
      phone: pharmacy?.phone || "",
      google_map_link: pharmacy?.google_map_link || "",
    });
    setShowEditForm(true);
  };

  const handleFormChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setProfilePicture(file);
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("email", profileForm.email);
      if (profileForm.phone) {
        formData.append("phone", profileForm.phone);
      }
      if (profileForm.google_map_link) {
        formData.append("google_map_link", profileForm.google_map_link);
      }
      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      await updateUserProfile(formData);

      toast.success("Profile updated successfully");
      setShowEditForm(false);
      setProfilePicture(null);
      fetchPharmacyProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      const msg = err.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
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
    
    // Check if trying to add a second address
    if (!editingAddress && addresses.length > 0) {
      toast.error("Only one address is allowed. Please edit or delete the existing address.");
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
      fetchPharmacyProfile();
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
      fetchPharmacyProfile();
    } catch (err) {
      console.error("Error deleting address:", err);
      const msg = err.response?.data?.message || "Failed to delete address";
      toast.error(msg);
    }
  };

  return (
    <>
      <PharmacyOwnerNav />
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50">
        <main className="max-w-screen-2xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">
            Pharmacy Profile
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading pharmacy profile...
            </div>
          ) : (
            <>
              {/* Pharmacy Info */}
              <section className="bg-white rounded-lg shadow border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Profile Picture */}
                    {pharmacy?.profile_picture &&
                    pharmacy.profile_picture.trim() !== "" ? (
                      <img
                        src={`http://localhost:8000/storage/${pharmacy.profile_picture}`}
                        alt={pharmacy?.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          const fallback = document.createElement("div");
                          fallback.className =
                            "w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600";
                          fallback.textContent =
                            pharmacy?.name?.charAt(0).toUpperCase() || "P";
                          parent.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                        {pharmacy?.name?.charAt(0).toUpperCase() || "P"}
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {pharmacy?.name}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>

                {/* Profile Edit Form */}
                {showEditForm && (
                  <form
                    onSubmit={handleSubmitProfile}
                    className="bg-gray-50 rounded p-4 mb-6"
                  >
                    <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) =>
                            handleFormChange("name", e.target.value)
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            handleFormChange("email", e.target.value)
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) =>
                            handleFormChange("phone", e.target.value)
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Google Map Link
                        </label>
                        <input
                          type="url"
                          value={profileForm.google_map_link}
                          onChange={(e) =>
                            handleFormChange("google_map_link", e.target.value)
                          }
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Picture
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        {profilePicture && (
                          <p className="text-xs text-gray-600 mt-1">
                            Selected: {profilePicture.name}
                          </p>
                        )}
                      </div>
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
                        {submitting ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditForm(false);
                          setProfilePicture(null);
                        }}
                        className="px-4 py-2 rounded border text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {pharmacy?.email || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {pharmacy?.phone || "—"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Google Map Link</p>
                    {pharmacy?.google_map_link ? (
                      <a
                        href={pharmacy.google_map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View on Google Maps
                      </a>
                    ) : (
                      <p className="font-medium text-gray-900">—</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Address Section */}
              <section className="bg-white rounded-lg shadow border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-blue-900">
                    Pharmacy Address
                  </h2>
                  {addresses.length === 0 && !showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                    >
                      Add Address
                    </button>
                  )}
                  {showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 rounded border text-sm"
                    >
                      Cancel
                    </button>
                  )}
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

                {/* Address Display */}
                {addresses.length === 0 && !showAddressForm ? (
                  <p className="text-sm text-gray-500">No address yet.</p>
                ) : addresses.length > 0 && !showAddressForm ? (
                  <div className="border rounded-lg p-4 border-gray-200">
                    <p className="font-medium text-gray-900">
                      {addresses[0].address_line_1}
                    </p>
                    {addresses[0].address_line_2 && (
                      <p className="text-sm text-gray-600">
                        {addresses[0].address_line_2}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {addresses[0].city}, {addresses[0].state} {addresses[0].zip_code}
                    </p>
                    {addresses[0].country && (
                      <p className="text-sm text-gray-600">
                        {addresses[0].country}
                      </p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEditAddress(addresses[0])}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addresses[0].id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : null}
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
