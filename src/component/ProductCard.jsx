import Button from "./Button";

export default function ProductCard({ productName, pharmacyName, price }) {
  return (
    <div className="cardsection p-4 bg-white"> 
    <div className="card bg-white border border-gray-300 rounded-xl p-4 hover:shadow-lg transform hover:-translate-y-1 transition">
      <img
        src="/medi-Image/m1.jpg"
        alt="Dummy Product 2"
        className="card-image w-32 h-32 object-contain mx-auto mb-3"
      />
      <div className="w-full text-left">
        <h3 className="text-sm font-semibold text-blue-900 truncate">
          productName
        </h3>
        <p className="text-sm text-gray-600 mt-1">pharmacyName</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium">৳ price</span>
          <Button buttonText={"ADD"} />
        </div>
      </div>
    </div>
    </div>
  );
}
