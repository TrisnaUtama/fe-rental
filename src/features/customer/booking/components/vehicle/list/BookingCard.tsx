import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Eye, ChevronDown,  Users, Settings2, Calendar } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type {
  BookingResponse,
  BookingStatus,
} from "../../../types/booking.type";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";

const formatRupiah = (value: string | number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));
const getDayDifference = (start: string, end: string) => {
  if (!start || !end) return 1;
  const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 1;
};

interface BookingCardProps {
  booking: BookingResponse;
  onViewDetails: (bookingId: string) => void;
}

export function BookingCard({ booking, onViewDetails }: BookingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const vehicles = booking.booking_vehicles ?? [];
  const vehicleCount = vehicles.length;
  const primaryVehicle = vehicles[0]?.vehicle;

  const days = getDayDifference(booking.start_date, booking.end_date!);
  const status = (booking.status as BookingStatus) ?? "SUBMITTED";

  const cardTitle = vehicleCount > 1 ? `${vehicleCount} Vehicles Booked` : primaryVehicle?.name ?? "Booking Details";
  const cardSubtitle = vehicleCount > 1 ? `${primaryVehicle?.name} & ${vehicleCount - 1} other(s)` : primaryVehicle?.brand ?? "Vehicle rental";

  return (
    <Card
      className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 relative flex-shrink-0">
            <img
              src={primaryVehicle?.image_url?.[0] || "/placeholder.svg"}
              alt={cardTitle}
              className="w-full h-full object-cover rounded-lg bg-gray-100"
            />
            {vehicleCount > 1 && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                    +{vehicleCount - 1}
                </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 truncate">
              {cardTitle}
            </h3>
            <p className="text-sm text-gray-500 truncate">{cardSubtitle}</p>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {format(new Date(booking.start_date), "dd MMM")} -{' '}
                {format(new Date(booking.end_date!), "dd MMM yyyy")}
              </span>
            </div>

            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-lg font-bold text-gray-900">
              {formatRupiah(booking.total_price!)}
            </p>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold mt-1">
              Details{" "}
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: "1rem" }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="pt-4 border-t space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Booked Vehicles ({vehicleCount})</h4>
                    <div className="space-y-3">
                        {vehicles.map(({ vehicle }) => (
                            <div key={vehicle.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                <img src={vehicle.image_url?.[0]} alt={vehicle.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-gray-900">{vehicle.brand} {vehicle.name}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{vehicle.capacity} Seats</span>
                                        <span className="flex items-center gap-1"><Settings2 className="w-3 h-3"/>{vehicle.transmition}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Booking ID</span>
                    <span className="font-semibold text-gray-700 font-mono">#{booking.id.slice(-8)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Duration</span>
                    <span className="font-semibold text-gray-700">{days} Day(s)</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(booking.id)} className="gap-2"><Eye className="w-4 h-4" />View Details</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}