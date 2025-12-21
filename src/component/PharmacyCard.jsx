import Button from "./Button";

export default function PharmacyCard({
  name = "Pharmacy Name",
  address = "Address not available",
  img = "/medi-Image/MediBear-Main-Logo.png",
  onView,
}) {
  return (
    <div className="cardsection p-1 bg-white">
      <div className="card w-60 bg-white border border-gray-300 rounded-xl p-1 hover:shadow-lg transform hover:-translate-y-1 transition">
        <img
          src={img}
          alt={name}
          className="card-image w-32 h-32 object-contain mx-auto mb-2"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/medi-Image/MediBear-Main-Logo.png";
          }}
        />
        <div className="text-left p-3">
          <h3 className="text-sm font-semibold text-blue-900 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {address}
          </p>
          <div className="flex items-center justify-end mt-2">
            <Button buttonText={"View"} onClick={onView} />
          </div>
        </div>
      </div>
    </div>
  );
}
