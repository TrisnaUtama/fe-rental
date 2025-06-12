import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "../../vehicle/list/StatusBadge";
import type { BookingResponse } from "../../../types/booking.type";
import type { BookingStatus } from "@/shared/enum/enum";

interface BookingDetailHeaderProps {
  booking: BookingResponse;
  onBack: () => void;
}

export function BookingDetailHeaderTravel({ booking, onBack }: BookingDetailHeaderProps) {
  return (
    <header className="mb-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="group text-sm flex items-center gap-2 text-gray-600 hover:text-gray-900 px-0 hover:bg-transparent mb-4"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Booking List
      </Button>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <p className="text-sm text-gray-500">Booking ID</p>
          <h1 className="text-3xl font-bold text-gray-900 font-mono">
            #{booking.id}
          </h1>
        </div>
        <StatusBadge status={booking.status as BookingStatus} />
      </div>
    </header>
  );
}