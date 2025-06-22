import { Link } from "react-router-dom";
import type { IDestination } from "@/features/admin/protected/destinations/types/destination.type";
import {  MapPin, Clock } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export function DestinationCard({ destination }: { destination: IDestination; }) {

  return (
    <motion.div variants={cardVariants}>
      <Link to={`/destination/${destination.id}`} className="block group h-full">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full">
          <div className="relative h-56 overflow-hidden">
            <img
              src={destination.image_urls?.[0] || "/placeholder.svg"}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="p-5 flex flex-col flex-grow">
            {destination.category && (
              <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                {destination.category}
              </p>
            )}

            <h3 className="font-bold text-xl text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
              {destination.name}
            </h3>

            {/* Footer section pushed to the bottom */}
            <div className="mt-auto pt-4 border-t border-dashed space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{destination.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{destination.open_hour}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
