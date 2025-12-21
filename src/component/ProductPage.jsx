import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { getPopularProductsWithPagination } from "../service/http";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductCard from "./ProductCard";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchParams] = useSearchParams();

  const pharmacyId = searchParams.get("pharmacyId");
  const pharmacyName = searchParams.get("pharmacyName");
  const prevPharmacyIdRef = useRef(pharmacyId);

  const limit = 20;

  const fetchProducts = async (off, pharmacyFilter) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPopularProductsWithPagination(
        off,
        limit,
        pharmacyFilter,
      );
      const data = response.data.data;
      setProducts(Array.isArray(data) ? data : []);
      // Check if there are more products for the next page
      setHasMore(data.length === limit);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    if (!product) return;

    const existing = (() => {
      try {
        return JSON.parse(localStorage.getItem("cart")) || [];
      } catch (e) {
        return [];
      }
    })();

    const payload = {
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      pharmacyId: product.user?.id,
      pharmacyName: product.user?.name || "Unknown",
      image:
        product.image_path
          ? `http://localhost:8000/storage/${product.image_path}`
          : "/medi-Image/MediBear-Main-Logo.png",
    };

    const index = existing.findIndex((item) => item.id === payload.id);

    if (index >= 0) {
      existing[index] = {
        ...existing[index],
        quantity: (existing[index].quantity || 1) + 1,
      };
    } else {
      existing.push({ ...payload, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existing));
    toast.success("Added to cart");

    // Notify listeners (e.g., navbar badge) in this tab
    window.dispatchEvent(new Event("cart-updated"));
  };

  useEffect(() => {
    const prevPharmacyId = prevPharmacyIdRef.current;
    const hasPharmacyChanged = prevPharmacyId !== pharmacyId;

    if (hasPharmacyChanged) {
      prevPharmacyIdRef.current = pharmacyId;
      if (offset !== 0) {
        setOffset(0);
        return;
      }
    }

    fetchProducts(offset, pharmacyId);
  }, [offset, pharmacyId]);

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

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow text-center mt-8 ml-4 mr-4 p-4 overflow-y-auto">
          {pharmacyId && pharmacyName && (
            <h1 className="text-2xl font-bold mb-6">{pharmacyName}</h1>
          )}

          {!pharmacyId && (
            <h1 className="text-2xl font-bold mb-6">All Products</h1>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded inline-block">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-gray-500">No products available.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 justify-items-center">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id || i}
                  img={
                    product.image_path
                      ? `http://localhost:8000/storage/${product.image_path}`
                      : "/medi-Image/MediBear-Main-Logo.png"
                  }
                  productName={product.name}
                  pharmacyName={product.user?.name || "Unknown"}
                  price={product.price || 0}
                  onAdd={() => addToCart(product)}
                />
              ))}
            </div>
          )}
        </div>

        {products.length > 0 && (
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
    </>
  );
}
