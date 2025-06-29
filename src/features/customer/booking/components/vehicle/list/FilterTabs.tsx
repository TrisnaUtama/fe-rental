import { Button } from "@/shared/components/ui/button";
import type { BookingStatus } from "../../../types/booking.type"; // Ensure this path is correct

interface FilterTabsProps {
  selectedStatus: BookingStatus | "ALL";
  onStatusChange: (status: BookingStatus | "ALL") => void;
  statusCounts: Record<BookingStatus | "ALL", number>;
}

const filterOptions: Array<{ value: BookingStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All My Bookings" },
  { value: "SUBMITTED", label: "Under review" },
  { value: "RECEIVED", label: "Booking Confirmed" }, 
  { value: "PAYMENT_PENDING", label: "Payment Pending" },
  { value: "CONFIRMED", label: "Payment Confirm" },
  { value: "CANCELED", label: "Canceled" },
  { value: "COMPLETE", label: "Ready to Go" },
  
  // Specific Rejection Statuses
  { value: "REJECTED_BOOKING", label: "Booking Rejected" }, 
  { value: "REJECTED_REFUND", label: "Refund Rejected" }, 
  { value: "REJECTED_RESHEDULE", label: "Reschedule Rejected" },
  
  // Request & Confirmation Statuses
  { value: "RESCHEDULE_REQUESTED", label: "Reschedule Request" },
  { value: "RESCHEDULED", label: "Rescheduled" }, 
  { value: "REFUND_REQUESTED", label: "Refund Request" },
  { value: "REFUNDED", label: "Refunded" },
];

export function FilterTabs({
  selectedStatus,
  onStatusChange,
  statusCounts,
}: FilterTabsProps) {
  return (
    <div className="border-b bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-2.5">
          {filterOptions.map((option) => {
            const isActive = selectedStatus === option.value;
            const count = statusCounts[option.value] || 0;

            return (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange(option.value)}
                className={`
                  flex-shrink-0 rounded-full px-4 py-1.5 h-auto text-sm font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow hover:bg-blue-700 hover:text-white"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }
                `}
              >
                {option.label}
                {count > 0 && (
                  <span
                    className={`
                      ml-2 px-2 py-0.5 rounded-full text-xs font-bold transition-colors
                      ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-700"
                      }
                    `}
                  >
                    {count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}