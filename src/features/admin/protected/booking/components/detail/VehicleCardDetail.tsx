import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Car, Map, Users, Settings2, Fuel, Palette } from "lucide-react";
import type { BookingResponse } from "../../types/booking.type";

const formatRupiah = (value: string | number | null | undefined) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));
const SpecItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode; }) => (<div><div className="text-xs text-gray-500 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" />{label}</div><div className="text-sm font-semibold text-gray-800 mt-1">{value}</div></div>);

const VehicleDetails = ({ booking }: { booking: BookingResponse }) => {
  const vehicles = booking.booking_vehicles ?? [];
  return (
    <div className="space-y-6">
      <CardHeader className="p-0 mb-4"><CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Car className="w-5 h-5 text-blue-500" />Vehicle Rental Details</CardTitle></CardHeader>
      <div className="space-y-4">
        {vehicles.length > 0 ? (vehicles.map(({ vehicle }) => (
            <div key={vehicle.id} className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 bg-white">
              <img src={vehicle.image_url?.[0]} alt={vehicle.name} className="w-full sm:w-40 h-32 sm:h-auto object-cover rounded-lg bg-gray-100 flex-shrink-0"/>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-900">{vehicle.brand} {vehicle.name}</h4>
                <p className="text-sm text-blue-600 font-medium capitalize">{vehicle.type?.replace("_", " ")}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <SpecItem icon={Users} label="Capacity" value={`${vehicle.capacity} Seats`} />
                  <SpecItem icon={Settings2} label="Transmission" value={vehicle.transmition} />
                  <SpecItem icon={Fuel} label="Fuel" value={vehicle.fuel} />
                  <SpecItem icon={Palette} label="Color" value={vehicle.color} />
                </div>
              </div>
            </div>
          ))) : (<p className="text-gray-500 text-center py-4">No vehicle details available.</p>)}
      </div>
    </div>
  );
};

const TravelPackageDetails = ({ booking }: { booking: BookingResponse }) => {
  const { travel_package: travelPackage, pax_option: paxOption } = booking;
  if (!travelPackage) return null;
  return (
    <div className="space-y-6">
      <CardHeader className="p-0 mb-4"><CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Map className="w-5 h-5 text-blue-500" />Travel Package Details</CardTitle></CardHeader>
      <div className="flex flex-col sm:flex-row gap-5 p-4 border rounded-lg bg-gray-50">
        <img src={travelPackage.image} alt={travelPackage.name} className="w-full sm:w-48 h-32 object-cover rounded-md flex-shrink-0"/>
        <div className="flex-1">
          <h4 className="text-xl font-bold">{travelPackage.name}</h4>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{travelPackage.description}</p>
          {paxOption && (<div className="mt-3"><SpecItem icon={Users} label="Pax Option" value={`${paxOption.pax} people (${formatRupiah(paxOption.price)})`} /></div>)}
        </div>
      </div>
    </div>
  );
};

export const VehicleDetailsCard = ({ booking }: { booking: BookingResponse }) => {
    const isTravelPackage = !!booking.travel_package_id;
    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
                {isTravelPackage ? <TravelPackageDetails booking={booking} /> : <VehicleDetails booking={booking} />}
            </CardContent>
        </Card>
    );
};