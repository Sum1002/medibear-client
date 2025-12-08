export default function Footer() {
    return (
        <footer className="bg-gradient-to-bl from-blue-900 to-blue-600 text-white mt-12">
    <div className="max-w-screen-2xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:pr-6">
        {/* Logo without white box */}
        <img src="./medi-Image/nlogo.png" alt="MediBear" className="h-16 mb-4" />
        {/* Footer description text */}
        <p className="text-gray-200 text-sm mt-0 max-w-xs">Fast, reliable medicine delivery from verified pharmacies near you</p>
      </div>
      <div className="flex justify-between md:justify-center">
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="text-gray-300 text-sm space-y-2">
            <li><a href="about.html" className="hover:underline">About</a></li>
            <li><a href="contact.html" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
          </ul>
        </div>
        <div className="ml-8 md:ml-12">
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="text-gray-300 text-sm space-y-2">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Shipping</a></li>
            <li><a href="#" className="hover:underline">Returns</a></li>
          </ul>
        </div>
      </div>

      <div className="md:text-right">
        <h4 className="text-white font-semibold mb-3">Contact</h4>
        <p className="text-gray-300 text-sm">support@medibear.com</p>
        <p className="text-gray-300 text-sm">+880 1234 567890</p>
        <div className="flex gap-3 mt-4 justify-start md:justify-end">
          {/* Simple social icons */}
          <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.97 3.66 9.09 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.76-1.61 1.54v1.85h2.74l-.44 2.89h-2.3V22c4.78-.79 8.44-4.91 8.44-9.93z"/></svg>
          </a>
          <a href="#" className="text-gray-300 hover:text-white" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 5.92c-.63.28-1.3.48-2.01.57.72-.43 1.27-1.12 1.53-1.94-.68.4-1.43.69-2.22.85C18.7 4.42 17.5 4 16.2 4c-1.86 0-3.37 1.5-3.37 3.35 0 .26.03.52.08.76C9.03 8.01 6.1 6.3 4.03 3.74c-.29.5-.46 1.08-.46 1.7 0 1.17.6 2.2 1.51 2.8-.56-.02-1.09-.17-1.55-.42v.04c0 1.62 1.15 2.96 2.68 3.27-.28.08-.58.12-.88.12-.21 0-.42-.02-.62-.06.42 1.29 1.63 2.23 3.06 2.26-1.12.87-2.53 1.4-4.07 1.4-.26 0-.52-.02-.78-.05 1.44.93 3.15 1.47 4.99 1.47 5.99 0 9.27-4.82 9.27-9.01v-.41c.64-.46 1.2-1.03 1.64-1.68-.58.26-1.21.44-1.86.52.67-.41 1.18-1.07 1.42-1.85z"/></svg>
          </a>
          <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.4.58.2 1 .44 1.44.884.44.44.684.86.884 1.44.16.46.346 1.26.4 2.43.058 1.267.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.4 2.43-.2.58-.44 1-.884 1.44-.44.44-.86.684-1.44.884-.46.16-1.26.346-2.43.4-1.267.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.4-.58-.2-1-.44-1.44-.884-.44-.44-.684-.86-.884-1.44-.16-.46-.346-1.26-.4-2.43C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.054-1.17.24-1.97.4-2.43.2-.58.44-1 .884-1.44.44-.44.86-.684 1.44-.884.46-.16 1.26-.346 2.43-.4C8.416 2.212 8.8 2.2 12 2.2zm0 3.4A6.4 6.4 0 1 0 18.4 12 6.408 6.408 0 0 0 12 5.6zm0 10.56A4.16 4.16 0 1 1 16.16 12 4.165 4.165 0 0 1 12 16.16zm6.4-11.68a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z"/></svg>
          </a>
        </div>
      </div>
    </div>

  <div className="border-t border-blue-900">
  <div className="max-w-screen-2xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
        <p>© <span id="year">2025</span> MediBear. All rights reserved.</p>
        <div className="mt-2 md:mt-0">
          <a href="#" className="hover:underline mr-4">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
      </div>
    </div>
  </footer>
    );
}