import { Card, CardContent } from "@/shared/components/ui/card";
import { Calendar, Car, FileText, Users, Palette, Settings2, Fuel, ArrowRight } from "lucide-react";
import type { BookingResponse } from "../../../types/booking.type";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const SpecItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div>
        <div className="text-xs text-gray-500 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" />{label}</div>
        <div className="text-sm font-semibold text-gray-800 mt-1">{value}</div>
    </div>
);

interface BookingInfoCardProps {
  booking: BookingResponse;
}

export function BookingInfoCard({ booking }: BookingInfoCardProps) {
  const vehicles = booking.booking_vehicles ?? [];
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-blue-500"/>Rental Period</h3>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="font-bold text-gray-800">{format(new Date(booking.start_date), "dd MMM yyyy", { locale: id })}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="h-px w-8 bg-gray-200"></div> <ArrowRight className="w-4 h-4"/> <div className="h-px w-8 bg-gray-200"></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">End Date</p>
              <p className="font-bold text-gray-800">{format(new Date(booking.end_date!), "dd MMM yyyy", { locale: id })}</p>
            </div>
          </div>
        </div>
        <hr/>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"><Car className="w-5 h-5 text-blue-500"/>Vehicle(s) Booked</h3>
          <div className="space-y-4">
            {vehicles.map(({ vehicle }) => (
              <div key={vehicle.id} className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 bg-white">
                <img src={vehicle.image_url?.[0]} alt={vehicle.name} className="w-full sm:w-40 h-32 sm:h-auto object-cover rounded-lg bg-gray-100"/>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900">{vehicle.brand} {vehicle.name}</h4>
                  <p className="text-sm text-blue-600 font-medium capitalize">{vehicle.type.replace("_", " ")}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <SpecItem icon={Users} label="Capacity" value={`${vehicle.capacity} Seats`} />
                    <SpecItem icon={Settings2} label="Transmission" value={vehicle.transmition} />
                    <SpecItem icon={Fuel} label="Fuel" value={vehicle.fuel} />
                    <SpecItem icon={Palette} label="Color" value={vehicle.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr/>
        {/* Additional Notes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-blue-500"/>Additional Notes</h3>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
            {booking.notes || <span className="text-gray-400 italic">No additional notes provided.</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}