import { Link } from "react-router-dom";
import type { IDestination } from "@/features/admin/protected/destinations/types/destination.type";
import { Heart, MapPin, Clock } from "lucide-react";

export function DestinationCard({
  destination,
}: {
  destination: IDestination;
}) {
  return (
    <Link to={`/destination/${destination.id}`} className="block group h-full">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
        <div className="relative h-56 overflow-hidden">
          <img
            src={destination.image_urls?.[0] || "/placeholder.svg"}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer">
            <Heart className="h-5 w-5 text-gray-700 group-hover:text-red-500 transition-colors" />
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {destination.category && (
            <p className="text-xs font-bold text-blue-600 uppercase mb-2 flex-shrink-0">
              {destination.category}
            </p>
          )}

          <h3 className="font-bold text-xl text-gray-900 line-clamp-none mb-3 flex-shrink-0">
            {destination.name}
          </h3>

          <div className="flex flex-col justify-end flex-grow"> 
            <div className="space-y-3 text-sm text-gray-600 mt-auto pt-3 border-t">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{destination.address}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                <span>{destination.open_hour}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}