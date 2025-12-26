import Button from "./Button";

export default function PharmacyCard({
  name = "Pharmacy Name",
  address = "Address not available",
  img = "/medi-Image/MediBear-Main-Logo.png",
  isFavorite = false,
  onView,
  onFavoriteToggle,
}) {
  return (
    <div className="cardsection  bg-white">
      <div className="card w-60 bg-white border border-gray-300 rounded-xl p-1 hover:shadow-lg transform hover:-translate-y-1 transition">
        <div className="relative">
          <img
            src={img}
            alt={name}
            className="card-image w-full h-52 object-cover rounded-t-xl mb-2"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/medi-Image/MediBear-Main-Logo.png";
            }}
          />
          {onFavoriteToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle();
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow hover:shadow-md transition"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: isFavorite ? "#dc2626" : "#9ca3af" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="text-left p-3">
          <h3 className="text-sm font-semibold text-blue-900 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 min-h-10">
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
