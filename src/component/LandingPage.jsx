import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductCard from "./ProductCard";
import PopularCategoryCard from './PopularCategoryCard';
import Footer from "./Footer";

export default function LandingPage() {
  const categories = [
    { img: '/medi-Image/Vaccin.png', name: 'Vaccines' },
    { img: '/medi-Image/inh.png', name: 'Inhalers' },
    { img: '/medi-Image/injection.png', name: 'Injections' },
    { img: '/medi-Image/image.png', name: 'Analgesics' },
    { img: '/medi-Image/Anti.png', name: 'Antibiotics' },
    { img: '/medi-Image/supli.png', name: 'Supplements' },
  ];

  return (
    <>
      <Navbar />
      <HeroSection/>
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
          {(() => {
            // explicit list of available images in public/medi-Image
            const images = [
              '/medi-Image/m1.jpg',
              '/medi-Image/m2.png',
              '/medi-Image/m4.jpeg',
              '/medi-Image/m5.jpg',
              '/medi-Image/m6.webp',
              '/medi-Image/m7.webp',
              '/medi-Image/m8.png',
            ];

            return Array.from({ length: 12 }).map((_, i) => (
              <ProductCard
                key={i}
                img={images[i % images.length]}
                productName={`Product ${i + 1}`}
                pharmacyName={`Pharmacy ${((i % 5) + 1)}`}
                price={199 + i * 10}
              />
            ));
          })()}
        </div>
      </div>
      <Footer/>
    </>
  );
}