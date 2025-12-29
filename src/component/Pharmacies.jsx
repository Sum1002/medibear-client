import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPharmaciesWithPagination, getUserDetails, addFavoritePharmacy, removeFavoritePharmacy } from "../service/http";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PharmacyCard from "./PharmacyCard";
import toast, { Toaster } from "react-hot-toast";

export default function Pharmacies() {
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 20;

  const fetchPharmacies = async (off) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPharmaciesWithPagination(off, limit);
      const data = response.data.data;
      setPharmacies(Array.isArray(data) ? data : []);
      setHasMore(data.length === limit);
    } catch (err) {
      console.error("Error fetching pharmacies:", err);
      setError("Failed to load pharmacies");
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies(offset);
    // Only attempt to fetch favorites when user is logged in
    if (localStorage.getItem('auth_token')) {
      fetchFavorites();
    } else {
      setFavoriteIds([]);
    }
  }, [offset]);

  const fetchFavorites = async () => {
    try {
      const res = await getUserDetails();
      const data = res.data?.data || res.data || {};
      const favs = Array.isArray(data.favorite_pharmacies) ? data.favorite_pharmacies : [];
      setFavoriteIds(favs.map(f => f.id || f.pharmacy_id));
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const handleFavoriteToggle = async (pharmacyId) => {
    // If user not logged in, redirect to login
    if (!localStorage.getItem('auth_token')) {
      navigate('/login');
      return;
    }

    const isFav = favoriteIds.includes(pharmacyId);
    try {
      if (isFav) {
        await removeFavoritePharmacy(pharmacyId);
        setFavoriteIds(prev => prev.filter(id => id !== pharmacyId));
        toast.success("Removed from favorites");
      } else {
        await addFavoritePharmacy(pharmacyId);
        setFavoriteIds(prev => [...prev, pharmacyId]);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      const msg = err.response?.data?.message || "Failed to update favorites";
      toast.error(msg);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setOffset(offset + limit);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
      window.scrollTo(0, 0);
    }
  };

  const handleViewProducts = (pharmacyId, pharmacyName) => {
    if (!pharmacyId) return;
    navigate(`/products?pharmacyId=${pharmacyId}&pharmacyName=${encodeURIComponent(pharmacyName)}`);
  };

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />

      <div className="flex flex-col min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-6 w-full">
          <div className="mt-12 mb-12">
            <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">Pharmacies</h1>
            
            {/* Search bar */}
            <div className="mb-6 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search pharmacies by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-12 text-gray-500 text-center">Loading pharmacies...</div>
            ) : pharmacies.length === 0 ? (
              <div className="py-12 text-gray-500 text-center">No pharmacies available.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pharmacies.filter(pharmacy => 
                  pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((pharmacy, i) => {
                  const address = pharmacy.addresses && pharmacy.addresses.length > 0
                    ? `${pharmacy.addresses[0].address_line_1}, ${pharmacy.addresses[0].city}, ${pharmacy.addresses[0].state} ${pharmacy.addresses[0].zip_code}`
                    : "";
                  
                  return (
                    <PharmacyCard
                      key={pharmacy.id || i}
                      img={
                        pharmacy.profile_picture
                          ? `http://localhost:8000/storage/${pharmacy.profile_picture}`
                          : "/medi-Image/MediBear-Main-Logo.png"
                      }
                      name={pharmacy.name}
                      address={address}
                      isFavorite={favoriteIds.includes(pharmacy.id)}
                      onView={() => handleViewProducts(pharmacy.id, pharmacy.name)}
                      onFavoriteToggle={() => handleFavoriteToggle(pharmacy.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {pharmacies.length > 0 && (
          <div className="sticky bottom-0 flex justify-center gap-4 py-6 bg-white border-t">
            <button
              onClick={handlePrev}
              disabled={offset === 0 || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {Math.floor(offset / limit) + 1}
            </span>
            <button
              onClick={handleNext}
              disabled={!hasMore || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
