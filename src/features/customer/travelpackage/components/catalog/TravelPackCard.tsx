import { Link } from "react-router-dom";
import type { ITravelPack } from "@/features/admin/protected/travel-pack/types/travel-pack";
import { Heart, MapPin } from "lucide-react";

const getStartingPrice = (paxOptions: ITravelPack["pax_options"]) => {
  if (!paxOptions || paxOptions.length === 0) return null;
  return Math.min(...paxOptions.map((p) => parseFloat(p.price.toString())));
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function TravelPackCard({ travelPack }: { travelPack: ITravelPack }) {
  const startingPrice = getStartingPrice(travelPack.pax_options);

  return (
    <Link to={`/travel/${travelPack.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
        <div className="relative h-56 overflow-hidden">
          <img
            src={travelPack.image || "/placeholder.svg"}
            alt={travelPack.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute top-0 right-0 p-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer">
              <Heart className="h-5 w-5 text-gray-700 hover:text-red-500 transition-colors" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-tr-xl">
            {travelPack.duration} {travelPack.duration > 1 ? "Days" : "Day"}
          </div>
        </div>
        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-bold text-xl text-gray-800 line-clamp-1 mb-3">{travelPack.name}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{travelPack.travel_package_destinations?.length || 0} Destinations</span>
          </div>
          <div className="flex items-end justify-between mt-auto pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="text-2xl font-bold text-gray-900">
                {startingPrice ? currencyFormatter.format(startingPrice) : "N/A"}
              </p>
            </div>
            <div className="text-blue-600 font-semibold group-hover:underline">Details</div>
          </div>
        </div>
      </div>
    </Link>
  );
}