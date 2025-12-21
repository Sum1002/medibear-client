import Button from "./Button";

export default function ProductCard({
  productName = "Cough Syrup 100ml",
  pharmacyName = "HealthPlus",
  price = 220,
  img = "/medi-Image/m1.jpg",
  onAdd,
}) {
  return (
    <div className="cardsection p-1 bg-white">
      <div className="card w-60 bg-white border border-gray-300 rounded-xl p-1 hover:shadow-lg transform hover:-translate-y-1 transition">
        <img
          src={img}
          alt={productName}
          className="card-image w-32 h-32 object-contain mx-auto mb-2"
          onError={(e) => {
            // fallback to main logo if image missing
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/medi-Image/MediBear-Main-Logo.png';
          }}
        />
        <div className=" text-left p-3">
          <h3 className="text-sm font-semibold text-blue-900 truncate">{productName}</h3>
          <p className="text-sm text-gray-600">{pharmacyName}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">৳ {price}</span>
            <Button buttonText={"ADD"} onClick={onAdd} />
          </div>
        </div>
      </div>
    </div>
  );
}
