import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getPharmaciesWithPagination } from "../service/http";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PharmacyCard from "./PharmacyCard";

export default function Pharmacies() {
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

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
  }, [offset]);

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

  const handleViewProducts = (pharmacyId) => {
    if (!pharmacyId) return;
    navigate(`/products?pharmacyId=${pharmacyId}`);
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow text-center mt-8 ml-4 mr-4 p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Pharmacies</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded inline-block">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-gray-500">Loading pharmacies...</div>
          ) : pharmacies.length === 0 ? (
            <div className="py-12 text-gray-500">No pharmacies available.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 justify-items-center">
              {pharmacies.map((pharmacy, i) => (
                <PharmacyCard
                  key={pharmacy.id || i}
                  img={
                    pharmacy.image_path
                      ? `http://localhost:8000/storage/${pharmacy.image_path}`
                      : "/medi-Image/MediBear-Main-Logo.png"
                  }
                  name={pharmacy.name}
                  address={pharmacy.address || ""}
                  onView={() => handleViewProducts(pharmacy.id)}
                />
              ))}
            </div>
          )}
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
