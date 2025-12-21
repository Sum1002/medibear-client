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
    { img: '/medi-Image/Vaccin.png', name: 'Vaccines' },
    { img: '/medi-Image/inh.png', name: 'Inhalers' },
    { img: '/medi-Image/injection.png', name: 'Injections' },
    { img: '/medi-Image/image.png', name: 'Analgesics' },
    { img: '/medi-Image/Anti.png', name: 'Antibiotics' },
    { img: '/medi-Image/supli.png', name: 'Supplements' },
  ];

  const [popularProducts, setPopularProducts] = useState([]);

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
      {/* Popular categories: 6 small cards */}
      <div className="text-center mt-8 ml-4 mr-4 p-4">
        <h2 className="text-xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 justify-items-stretch items-stretch">
          {categories.map((c, idx) => (
            <div className="w-full" key={idx}>
              <PopularCategoryCard img={c.img} name={c.name} />
            </div>
          ))}
        </div>
      </div>

      {/* Popular products */}
      <div className="text-center mt-8 ml-4 mr-4 p-4">
        <h1 className="text-xl font-bold mb-6">Popular Product</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          { popularProducts.map((product, i) => (
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
        <div className="flex justify-center mt-6">
          <Button buttonText="View More" onClick={() => {
            window.location.href = "/products";
          }}/>
        </div>
      </div>
      <Footer />
    </>
  );
}
