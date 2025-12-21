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
import Home from './component/Home.jsx';
import PopularCategoryCard from './component/PopularCategoryCard.jsx';
import Footer from './component/Footer.jsx';
import CustomerIndex from './component/CustomerIndex.jsx';
import Inventory from './component/pharmacy-owner/Inventory.jsx';
import OrderManagement from './component/pharmacy-owner/OrderManagement.jsx';
import Complaints from './component/pharmacy-owner/Complaints.jsx';
import Summary from './component/pharmacy-owner/Summary.jsx';
import Suppliers from './component/pharmacy-owner/Suppliers.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/herosection" element={<HeroSection />} />
      <Route path="/pcard" element={<ProductCard />} />
      <Route path="/cart" element={<Cart />} /> 
      <Route path="/pccard" element={<PopularCategoryCard />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/customer" element={<CustomerIndex />} />
      <Route path="/pharmacy/inventory" element={<Inventory />} /> 
      <Route path="/pharmacy/orders" element={<OrderManagement />} />
      <Route path="/pharmacy/complaints" element={<Complaints />} />
      <Route path="/pharmacy/summary" element={<Summary />} />
      <Route path="/pharmacy/suppliers" element={<Suppliers />} />

      </Routes>
  </BrowserRouter>,
)
