import type { BookingResponse } from "@/features/customer/booking/types/booking.type";
import { TravelPackageRatingItem } from "./TravelPackRating";
import { DestinationRatingItem } from "./DestinationRatingItem";
import { VehicleRatingItem } from "./VehicleRatingForm";
import { Package, MapPin, Car } from "lucide-react";

interface TravelPackageRatingFormProps {
  booking: BookingResponse;
}

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
    <div className="flex items-center gap-3 pb-2 border-b">
        <Icon className="w-6 h-6 text-gray-500" />
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
);

export function TravelPackageRatingForm({ booking }: TravelPackageRatingFormProps) {
  const travelPackage = booking.travel_package;
  
  const travelPackageDestinations = booking.travel_package?.travel_package_destinations ?? [];
  const vehicles = booking.booking_vehicles ?? [];

  return (
    <div className="space-y-8">
      {travelPackage && (
        <section className="space-y-4">
            <SectionHeader icon={Package} title="Rate The Package" />
            <TravelPackageRatingItem
                travelPackage={travelPackage}
            />
        </section>
      )}

      {travelPackageDestinations.length > 0 && (
        <section className="space-y-4">
            <SectionHeader icon={MapPin} title="Rate The Destinations" />
            {travelPackageDestinations.map(tpDestination => (
                <DestinationRatingItem
                    key={tpDestination.id}
                    destination={tpDestination.destination!}
                />
            ))}
        </section>
      )}

      {vehicles.length > 0 && (
        <section className="space-y-4">
             <SectionHeader icon={Car} title="Rate The Vehicle(s) Used" />
             {vehicles.map(bookingVehicle => (
                <VehicleRatingItem
                    key={bookingVehicle.vehicle.id}
                    bookingVehicle={bookingVehicle}
                />
             ))}
        </section>
      )}
    </div>
  );
}
