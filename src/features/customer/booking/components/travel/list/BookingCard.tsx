import { Card, CardContent } from "@/shared/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { StatusBadge } from "../../vehicle/list/StatusBadge";
import type { BookingResponse, BookingStatus } from "../../../types/booking.type";
import { format } from "date-fns";
import { motion, type Variants } from "framer-motion"; 

const formatRupiah = (value: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));

interface BookingCardTravelProps {
  booking: BookingResponse;
  onViewDetails: (bookingId: string) => void;
}

export function BookingCardTravel({ booking, onViewDetails }: BookingCardTravelProps) {
  const { travel_package: travelPackage, status, start_date, total_price } = booking;

  if (!travelPackage) {
    return (
      <Card className="p-4 text-center text-red-500">
        Booking data is incomplete. Travel package details are missing.
      </Card>
    );
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group"
    >
      <Card 
        className="w-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(booking.id)}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={travelPackage.image}
            alt={travelPackage.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute top-0 right-0 p-3">
            <StatusBadge status={status as BookingStatus} />
          </div>
          <div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <CardContent className="p-4 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-xl leading-tight truncate">
              {travelPackage.name}
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(start_date), "dd MMMM, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {travelPackage.duration} Days
              </span>
            </div>
          </div>
          
          <div className="flex items-end justify-between pt-4 border-t">
            <div>
              <p className="text-xs text-gray-500">Total Price</p>
              <p className="text-2xl font-bold text-gray-800">
                  {formatRupiah(total_price!)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
              Details
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}