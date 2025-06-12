import { Card, CardContent } from "@/shared/components/ui/card";
import { Calendar, FileText, MapPin, ArrowRight } from "lucide-react";
import type { BookingResponse } from "../../../types/booking.type";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface BookingInfoCardTravelProps {
  booking: BookingResponse;
}

export function BookingInfoCardTravel({ booking }: BookingInfoCardTravelProps) {
  const { travel_package: travelPackage } = booking;

  if (!travelPackage) {
    return <Card><CardContent>Travel package details are missing.</CardContent></Card>;
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6 space-y-6">
        {/* Package Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-500" />
            Your Travel Package
          </h3>
          <div className="flex flex-col sm:flex-row gap-5 p-4 border rounded-lg bg-gray-50">
            <img
              src={travelPackage.image}
              alt={travelPackage.name}
              className="w-full sm:w-48 h-32 object-cover rounded-md"
            />
            <div className="flex-1">
              <h4 className="text-xl font-bold">{travelPackage.name}</h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {travelPackage.description}
              </p>
            </div>
          </div>
        </div>
        <hr />
        {/* Booking Period */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            Travel Dates
          </h3>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Departure Date</p>
              <p className="font-bold text-gray-800">
                {format(new Date(booking.start_date), "dd MMM yy", { locale: id })}
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="h-px w-8 bg-gray-200"></div>
              <ArrowRight className="w-4 h-4" />
              <div className="h-px w-8 bg-gray-200"></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">End Date</p>
              <p className="font-bold text-gray-800">
                {format(new Date(booking.end_date!), "dd MMM yy", { locale: id })}
              </p>
            </div>
          </div>
        </div>
        <hr />
        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-500" />
            Additional Notes
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
            {booking.notes || <span className="text-gray-400 italic">No additional notes provided.</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}