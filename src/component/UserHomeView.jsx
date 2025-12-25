import { useEffect, useState } from "react";
import { getPopularProducts } from "../service/http";
import toast, { Toaster } from "react-hot-toast";
import Button from "./Button";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import PopularCategoryCard from "./PopularCategoryCard";
import ProductCard from "./ProductCard";

export default function UserHomeView() {
  const categories = [
    { img: '/medi-Image/vac.png', name: 'Vaccines' },
    { img: '/medi-Image/inh.png', name: 'Inhalers' },
    { img: '/medi-Image/injection.png', name: 'Injections' , className: "w-full" },
    { img: '/medi-Image/image.png', name: 'Analgesics' },
    { img: '/medi-Image/Anti.png', name: 'Antibiotics' },
    { img: '/medi-Image/supli.png', name: 'Supplements' },
  ];

  const [popularProducts, setPopularProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowResults(true);
      const query = searchQuery.toLowerCase();
      const filtered = popularProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.user?.name?.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    // Fetch popular products from the backend API
    getPopularProducts()
      .then(response => {
        setPopularProducts(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching popular products:", error);
      });
  }, []);

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

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <HeroSection />
      
      {/* Search Bar Section - Between Hero and Body */}
      <div className="relative -mt-8 mb-8 z-10">
        <div className="max-w-screen-2xl mx-auto px-6 flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-3 shadow-2xl border border-gray-200 max-w-2xl w-full">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search for medicines..." 
              className="flex-1 outline-none text-gray-700 text-base bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {searchQuery && (
              <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button 
              onClick={handleSearch}
              className=" text-black px-6 py-2 rounded-full font-semibold hover:bg-blue-200 transition shadow-lg"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {showResults && (
        <div className="max-w-screen-2xl mx-auto px-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
              <button onClick={clearSearch} className="text-blue-600 hover:text-blue-700 font-semibold">
                Clear Search
              </button>
            </div>

            {/* Medicines Results */}
            {searchResults.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Medicines ({searchResults.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.map((product, i) => (
                    <ProductCard
                      key={i}
                      img={"http://localhost:8000/storage/" + product.image_path}
                      productName={product.name}
                      pharmacyName={product.user?.name || "Unknown"}
                      onAdd={() => addToCart(product)}
                      price={product.price}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try searching with different keywords</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main Content Container with Alignment */}
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Popular categories: 6 small cards */}
        <div className="mt-12 mb-12 bg-gradient-to-r from-white via-green-200 to-white">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8 justify-items-stretch">
            {categories.map((c, idx) => (
              <div key={idx}>
                <PopularCategoryCard img={c.img} name={c.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Popular products */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">Popular Products</h2>
        <div className="mt-8 bg-gradient-to-r from-white via-purple-200 to-white pt-4 pb-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 justify-items-stretch">
            { popularProducts.slice(0, 10).map((product, i) => (
                <ProductCard
                  key={i}
                  img={"http://localhost:8000/storage/" + product.image_path}
                  productName={product.name}
                  pharmacyName={product.user.name}
                  onAdd={() => addToCart(product)}
                  price={product.price}
                />
              ))
            }
          </div>
          {/* Centered button under products */}
          <div className="flex justify-center mt-2 mb-4">
            <Button buttonText="View More" onClick={() => {
              window.location.href = "/products";
            }}/>
          </div>
          
        </div>
      </div>
      
      {/* Why Choose MediBear Section */}
      <section className="py-14 px-10 bg-gray-100 ">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Why Choose MediBear?</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="bg-white rounded-xl shadow-lg flex flex-col items-center p-8 w-full md:w-1/4 hover:shadow-2xl active:shadow-inner transition-shadow duration-300 cursor-pointer">
            <div className="text-blue-600 text-3xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-900">Express Delivery</h3>
            <p className="text-gray-600 text-center">Get Medicine within 30 minutes</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg flex flex-col items-center p-8 w-full md:w-1/4 hover:shadow-2xl active:shadow-inner transition-shadow duration-300 cursor-pointer">
            <div className="text-blue-600 text-3xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l7 4v5c0 6.08-7 11-7 11S5 17.08 5 11V6l7-4z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-900">DGDA Verified pharmacies</h3>
            <p className="text-gray-600 text-center">Genuine & trusted pharmacies</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg flex flex-col items-center p-8 w-full md:w-1/4 hover:shadow-2xl active:shadow-inner transition-shadow duration-300 cursor-pointer">
            <div className="text-blue-600 text-3xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618A2 2 0 014.553 4.276L9 2m6 18l5.447-2.724A2 2 0 0021 15.382V5.618a2 2 0 00-1.553-1.342L15 2m0 18V2m-6 18V2" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-900">Real-Time Tracking</h3>
            <p className="text-gray-600 text-center">Track your order live</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
