"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Filter } from "lucide-react";
import type { BookingStatus } from "../../../types/booking.type"; 

interface BookingFilterProps {
  selectedStatus: BookingStatus | "ALL";
  onStatusChange: (status: BookingStatus | "ALL") => void;
}

const statusOptions: Array<{ value: BookingStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All My Bookings" },
  { value: "SUBMITTED", label: "Under review" },
  { value: "RECEIVED", label: "Booking Confirmed" }, 
  { value: "PAYMENT_PENDING", label: "Payment Pending" },
  { value: "CONFIRMED", label: "Payment Confirm" },
  { value: "CANCELED", label: "Canceled" },
  { value: "COMPLETE", label: "Ready to Go" },
  
  { value: "REJECTED_BOOKING", label: "Booking Rejected" }, 
  { value: "REJECTED_REFUND", label: "Refund Rejected" }, 
  { value: "REJECTED_RESHEDULE", label: "Reschedule Rejected" },
  
  { value: "RESCHEDULE_REQUESTED", label: "Reschedule Request" },
  { value: "RESCHEDULED", label: "Rescheduled" }, 
  { value: "REFUND_REQUESTED", label: "Refund Request" },
  { value: "REFUNDED", label: "Refunded" },
];

export function BookingFilter({
  selectedStatus,
  onStatusChange,
}: BookingFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Filter className="w-4 h-4" />
        <span>Filter:</span>
      </div>
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[200px] border-gray-200 bg-white">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}