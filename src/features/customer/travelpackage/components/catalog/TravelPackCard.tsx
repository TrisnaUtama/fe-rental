import { Link } from "react-router-dom";
import type { ITravelPack } from "@/features/admin/protected/travel-pack/types/travel-pack";
import {  MapPin, Clock, ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import React from "react";

const getStartingPrice = (paxOptions: ITravelPack["pax_options"]) => {
  if (!paxOptions || paxOptions.length === 0) return null;
  return Math.min(...paxOptions.map((p) => parseFloat(p.price.toString())));
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const SpecBadge = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
        <Icon className="w-3.5 h-3.5" />
        <span>{text}</span>
    </div>
);

export function TravelPackCard({ travelPack }: { travelPack: ITravelPack }) {
  const startingPrice = getStartingPrice(travelPack.pax_options);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} 
    >
        <Link to={`/travel/${travelPack.id}`} className="block group">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={travelPack.image || "/placeholder.svg"}
                        alt={travelPack.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-gray-800 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                        {travelPack.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                        <SpecBadge icon={Clock} text={`${travelPack.duration} ${travelPack.duration > 1 ? "Days" : "Day"}`} />
                        <SpecBadge icon={MapPin} text={`${travelPack.travel_package_destinations?.length || 0} Destinations`} />
                    </div>
                    
                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-dashed">
                        <div>
                            <p className="text-sm text-gray-500">From</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {startingPrice ? currencyFormatter.format(startingPrice) : "N/A"}
                            </p>
                        </div>
                        <div className="flex items-center text-blue-600">
                           <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </motion.div>
  );
}