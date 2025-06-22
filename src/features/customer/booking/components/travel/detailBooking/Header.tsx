import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Calendar, Clock, Activity } from "lucide-react"; // Refined icons
import { StatusBadge } from "../../vehicle/list/StatusBadge";
import type { BookingResponse } from "../../../types/booking.type";
import type { BookingStatus } from "@/shared/enum/enum";
import { format, differenceInCalendarDays } from "date-fns";
import React from "react";

const MetaInfo = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-center gap-3 text-sm">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">{label}:</span>
        <span className="font-semibold text-gray-800">{value}</span>
    </div>
);

interface BookingDetailHeaderProps {
  booking: BookingResponse;
  onBack: () => void;
}

export function BookingDetailHeaderTravel({ booking, onBack }: BookingDetailHeaderProps) {
  const duration = booking.end_date ? differenceInCalendarDays(new Date(booking.end_date), new Date(booking.start_date)) + 1 : 1;

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

      {/* The new header layout */}
      <div className="text-center py-8 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          {booking.travel_package?.name || 'Travel Package Booking'}
        </h1>
        
        {/* The new "meta info" line */}
        <div className="mt-4 flex justify-center items-center flex-wrap gap-x-6 gap-y-2">
          <MetaInfo 
            icon={Calendar}
            label="Departure"
            value={format(new Date(booking.start_date), "dd MMMM, yyyy")}
          />
          <div className="h-4 w-px bg-gray-200 hidden sm:block"></div> {/* Divider */}
          <MetaInfo 
            icon={Clock}
            label="Duration"
            value={`${duration} Day(s)`}
          />
          <div className="h-4 w-px bg-gray-200 hidden sm:block"></div> {/* Divider */}
          <div className="flex items-center gap-3 text-sm">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Status:</span>
              <StatusBadge status={booking.status as BookingStatus} />
          </div>
        </div>
      </div>
    </header>
  );
}