import { useEffect, useState } from "react";
import { getPopularProducts } from "../service/http";
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

  return (
    <>
      <Navbar />
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
                price={199 + i * 10}
              />
            ))
          }
        </div>
        {/* Centered button under products */}
        <div className="flex justify-center mt-6">
          <Button buttonText="View More" />
        </div>
      </div>
      <Footer />
    </>
  );
}
