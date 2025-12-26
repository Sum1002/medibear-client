export default function HeroSection() {
    return (
        <section className="relative w-full bg-linear-to-r from-blue-950 to-blue-700 text-white overflow-hidden">
  <div className="flex flex-col md:flex-row w-full">

    {/* LEFT: Text Content */}
    <div className="w-full md:w-2/2s flex items-center py-10">
      <div className="max-w-screen-2xl w-full px-6 ml-53">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          Your Trusted Online <br /> Medicine Partner
        </h1>

        <p className="mt-4 text-sm md:text-base text-blue-100 max-w-xl">
          Fast, reliable medicine delivery from verified pharmacies near you
        </p>

        <div className="flex gap-4 mt-8">
          <a
            href="/cart"
            className="bg-white text-blue-950 px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-50 transition"
          >
            Order Now
          </a>

          <a
            href="/register"
            className="border border-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-blue-700 transition"
          >
            Join as Pharmacy
          </a>
        </div>
      </div>
    </div>

    {/* RIGHT: Full-height Image */}
    <div className="relative w-full md:w-1/2">
      <img
        src="/medi-Image/h3.jpeg"
        alt="Medicine Delivery"
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-950/50 to-transparent"></div>
    </div>

  </div>
</section>

    );
}