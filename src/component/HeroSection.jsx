export default function HeroSection() {
    return (
        <section className="bg-gradient-to-r from-blue-950 to-blue-700 text-white py-10">
    <div className="max-w-screen-2xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">Your Trusted Online<br/>Medicine Partner</h1>
        <p className="mt-2 text-sm md:text-base text-blue-100 max-w-xl">Fast, reliable medicine delivery from verified pharmacies near you</p>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <a href="/cart" className="bg-white text-blue-950 px-5 py-2 rounded-md font-semibold shadow hover:bg-blue-50 transition">Order Now</a>
        <a href="/register" className="border border-white px-5 py-2 rounded-md font-semibold text-white hover:bg-white hover:text-blue-700 transition">Join as Pharmacy</a>
      </div>
    </div>
  </section>
    );
}