import Button from "./Button.jsx";

export default function Navbar() {
    return (
    <nav className="bg-white shadow py-2">
      <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="src/assets/medibear-main-logo.png" alt="MediBear" className="h-14" />
        </div>
        <ul className="hidden md:flex gap-8 font-medium">
          <li><a href="home.html" className="hover:text-blue-700">Home</a></li>
          <li><a href="pharmacy-page.html" className="hover:text-blue-700">Pharmacies</a></li>
          <li><a href="product-page.html" className="hover:text-blue-700">Products</a></li>
        </ul>
        <div className="flex items-center gap-4">
          <a href="cart.html" className="relative text-gray-700 hover:text-blue-700" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-600 rounded-full">0</span>
          </a>
          <a href="/login" ><Button/></a>
        </div>
      </div>
    </nav>);
}