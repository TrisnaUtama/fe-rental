import { Link } from "react-router-dom";
import type { IVehicle } from "@/features/admin/protected/vehicle/types/vehicle.type";
import { Users, Fuel, Cog } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import React from "react";
import type { DateRange } from "react-day-picker";
import { useCart } from "@/shared/context/cartContext";
import { Button } from "@/shared/components/ui/button";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

function formatVehicleType(type: string) {
  return type.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

const SpecBadge = ({ icon: Icon, text }: { icon: React.ElementType; text: string | number }) => (
    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
        <Icon className="w-3.5 h-3.5" />
        <span>{text}</span>
    </div>
);

export function VehicleCard({ vehicle, dateRange }: { vehicle: IVehicle, dateRange: DateRange }) {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some(item => item.vehicle.id === vehicle.id);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ vehicle, dateRange });
  };
  
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
    >
      <Link to="#" className="block group">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
          <div className="relative h-56 overflow-hidden">
            <img
              src={vehicle.image_url[0] || "/placeholder.svg"}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {formatVehicleType(vehicle.type)}
            </div>
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-xl text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{vehicle.brand} • {vehicle.year}</p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <SpecBadge icon={Users} text={`${vehicle.capacity} Penumpang`} />
              <SpecBadge icon={Cog} text={vehicle.transmition} />
              <SpecBadge icon={Fuel} text={vehicle.fuel} />
            </div>
            
            <div className="flex items-end justify-between mt-auto pt-4 border-t border-dashed">
              <div>
                <p className="text-sm text-gray-500">Start from</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currencyFormatter.format(Number(vehicle.price_per_day))}
                </p>
                <p className="text-sm text-gray-500">/ Day</p>
              </div>
              <Button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  size="lg"
                  className={`transition-all ${isInCart ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  aria-label={isInCart ? 'Ditambahkan ke keranjang' : 'Tambahkan ke keranjang'}
              >
                  {isInCart ? "Booked" : "Booking"}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}