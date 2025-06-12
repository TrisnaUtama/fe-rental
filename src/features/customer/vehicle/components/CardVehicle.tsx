import { Users, Fuel, Cog, Info, BadgeCheck, ChevronDown, ShoppingCart, CheckCircle, Building2, Calendar, Gauge, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { IVehicle } from "@/features/admin/protected/vehicle/types/vehicle.type";
import { useCart } from "@/shared/context/cartContext";
import type { DateRange } from "react-day-picker";
import { Button } from "@/shared/components/ui/button";
import { VehicleDetailRow } from "./VehicleDetailRow"; 

function formatVehicleType(type: string) {
  return type.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

interface Props {
  vehicle: IVehicle;
  onSelect: (id: string | null) => void;
  selected: boolean;
  dateRange: DateRange;
}

export function VehicleCard({ vehicle, onSelect, selected, dateRange }: Props) {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some(item => item.vehicle.id === vehicle.id);

  const isExpanded = selected; 
  const toggleExpansion = () => onSelect(isExpanded ? null : vehicle.id);
  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm overflow-hidden border-2 transition-all duration-300 ${
        isExpanded ? "border-blue-500 shadow-lg" : "border-transparent hover:border-gray-200"
      }`}
    >
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image */}
          <div className="w-full md:w-1/3 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <img src={vehicle.image_url[0] || "/placeholder.svg"} alt={vehicle.name} className="w-full h-full object-cover"/>
          </div>

          {/* Core Info */}
          <div className="flex flex-col flex-1">
            <span className="text-xs font-semibold text-blue-600 uppercase">{formatVehicleType(vehicle.type)}</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{vehicle.name}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Info className="w-3 h-3" /> or similar • DPS Airport Terminal
            </p>

            {/* Key Specs */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-gray-700">
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> {vehicle.capacity} Passengers</span>
              <span className="flex items-center gap-2 capitalize"><Cog className="w-4 h-4 text-gray-400" /> {vehicle.transmition.toLowerCase()}</span>
              <span className="flex items-center gap-2 capitalize"><Fuel className="w-4 h-4 text-gray-400" /> {vehicle.fuel.toLowerCase()}</span>
            </div>
            
            <div className="mt-auto pt-4 flex items-center gap-4">
              <Button onClick={toggleExpansion} variant="ghost" className="text-blue-600 font-semibold px-0 hover:bg-transparent">
                View Details <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="md:text-right flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 min-w-[180px]">
            <div className="text-left md:text-right">
              <p className="text-2xl font-extrabold text-gray-900">
                Rp {Number(vehicle.price_per_day).toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-500">per day</p>
            </div>
            <Button
              onClick={(e) => { e.stopPropagation(); addToCart({ vehicle, dateRange }); }}
              disabled={isInCart}
              className="w-full md:w-auto mt-0 md:mt-4 gap-2 transition-all"
            >
              {isInCart ? <><CheckCircle className="w-4 h-4" /> In Cart</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable Details Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { type: "spring", duration: 0.5 } }}
            exit={{ height: 0, opacity: 0, transition: { type: "tween", duration: 0.2 } }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-50/70 p-5 border-t border-gray-200 space-y-4">
              <h4 className="font-semibold text-gray-800">Vehicle Specifications</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <VehicleDetailRow icon={Building2} label="Brand" value={vehicle.brand} />
                  <VehicleDetailRow icon={Gauge} label="Kilometer" value={`${vehicle.kilometer.toLocaleString("id-ID")} km`} />
                  <VehicleDetailRow icon={Calendar} label="Year" value={vehicle.year} />
                  <VehicleDetailRow icon={BadgeCheck} label="Status" value={vehicle.status} />
                  <VehicleDetailRow icon={Palette} label="Color" value={vehicle.color} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-200">{vehicle.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}