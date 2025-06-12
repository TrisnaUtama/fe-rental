import { Button } from "@/shared/components/ui/button";
import { Map, Plus } from "lucide-react";

interface EmptyStateProps {
  onNewBooking: () => void;
}

export function EmptyStateTravel({ onNewBooking }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl shadow-sm">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5 border-4 border-white shadow-inner">
        <Map className="w-10 h-10 text-blue-400" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        No Travel Bookings Yet
      </h3>

      <p className="text-gray-500 mb-8 max-w-sm">
        Your next adventure is waiting! Explore our travel packages and book your dream trip today.
      </p>

      <Button
        onClick={onNewBooking}
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        Explore Travel Packages
      </Button>
    </div>
  );
}