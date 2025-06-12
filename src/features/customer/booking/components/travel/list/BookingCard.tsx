import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Calendar, Eye, Map } from "lucide-react";
import { StatusBadge } from "../../vehicle/list/StatusBadge";
import type { BookingResponse, BookingStatus } from "../../../types/booking.type";
import { format } from "date-fns";

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
  const { travel_package: travelPackage, status, start_date, total_price,  } = booking;

  if (!travelPackage) {
    return (
      <Card className="p-4 text-center text-red-500">
        Booking data is incomplete. Travel package details are missing.
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 group overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={travelPackage.image}
            alt={travelPackage.name}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0 bg-gray-100"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-semibold text-blue-600 uppercase">
                TRAVEL PACKAGE
              </p>
              <StatusBadge status={status as BookingStatus} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-600">
              {travelPackage.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(start_date), "dd MMM yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5" />
                {travelPackage.duration} Days
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div>
            <p className="text-lg font-bold text-gray-800">
              {formatRupiah(total_price!)}
            </p>
            <p className="text-xs text-gray-500">Total Price</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(booking.id)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}