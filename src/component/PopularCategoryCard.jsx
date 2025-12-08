export default function PopularCategoryCard({
  img = '/medi-Image/MediBear-Main-Logo.png',
  name = 'Category',
  onClick = null,
}) {
     return (
     <div className="group w-full">
      {/* card box with soft warm background */}
      <div
        role={onClick ? 'button' : undefined}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
          className="bg-rose-50 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-1 transition p-4 flex flex-col items-center text-center overflow-hidden cursor-pointer"
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(e);
        }}
      >
             <div className="w-full flex-1 flex items-center justify-center rounded-lg overflow-hidden p-2 bg-rose-50">
               <img
                 src={img}
                 alt={name}
                 className="inline-block h-44 max-w-full object-contain rounded-md"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/medi-Image/MediBear-Main-Logo.png';
            }}
          />
        </div>
      </div>

      {/* text outside the box */}
      <div className="mt-3 text-center pb-4">
        <p className="text-base font-semibold text-gray-800">{name}</p>
      </div>
    </div>
  );
}