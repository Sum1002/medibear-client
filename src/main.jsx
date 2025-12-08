import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import LoginForm from './component/LoginForm.jsx';
import RegistrationForm from './component/RegistrationForm.jsx';
import Navbar from './component/Navbar.jsx';
import HeroSection from './component/HeroSection.jsx';
import ProductCard from './component/ProductCard.jsx';
import Cart from'./component/Cart.jsx';
import LandingPage from './component/LandingPage.jsx';
import PopularCategoryCard from './component/PopularCategoryCard.jsx';
import Footer from './component/Footer.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/herosection" element={<HeroSection />} />
      <Route path="/pcard" element={<ProductCard />} />
      <Route path="/cart" element={<Cart />} /> 
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/pccard" element={<PopularCategoryCard />} />
      <Route path="/footer" element={<Footer />} />

    </Routes>
  </BrowserRouter>,
)
 