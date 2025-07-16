import { Badge } from "@/shared/components/ui/badge";
import type { BookingStatus } from "@/shared/enum/enum";
import { 
  Hourglass, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  ThumbsDown, 
  RefreshCw, 
  Archive 
} from "lucide-react";


export const statusConfig: Record<BookingStatus, { label: string; icon: React.ElementType; className: string }> = {
  SUBMITTED: { label: "Under Review", icon: Hourglass, className: "bg-gray-100 text-gray-700 border-gray-200" },
  
  // This status now clearly means the user needs to pay.
  RECEIVED: { label: "Awaiting Payment", icon: DollarSign, className: "bg-blue-100 text-blue-700 border-blue-200" },
  
  // This is the new "active" state after payment.
  CONFIRMED: { label: "Booking Confirmed", icon: CheckCircle, className: "bg-green-100 text-green-700 border-green-200" },
  
  PAYMENT_PENDING: { label: "Payment Processing", icon: DollarSign, className: "bg-orange-100 text-orange-700 border-orange-200" },
  COMPLETE: { label: "Complete", icon: CheckCircle, className: "bg-green-100 text-green-700 border-green-200" },
  CANCELED: { label: "Canceled", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
  
  
  REJECTED_BOOKING: { label: "Booking Rejected", icon: ThumbsDown, className: "bg-red-200 text-red-800 border-red-300" },
  REJECTED_REFUND: { label: "Refund Rejected", icon: XCircle, className: "bg-red-200 text-red-800 border-red-300" },
  REJECTED_RESHEDULE: { label: "Reschedule Rejected", icon: ThumbsDown, className: "bg-red-200 text-red-800 border-red-300" },

  RESCHEDULE_REQUESTED: { label: "Reschedule Pending", icon: Hourglass, className: "bg-purple-100 text-purple-700 border-purple-200" },
  RESCHEDULED: { label: "Rescheduled", icon: RefreshCw, className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  REFUND_REQUESTED: { label: "Refund Pending", icon: Hourglass, className: "bg-pink-100 text-pink-700 border-pink-200" },
  REFUNDED: { label: "Refunded", icon: Archive, className: "bg-gray-200 text-gray-700 border-gray-300" },
};

interface StatusBadgeProps {
  status?: BookingStatus;
  payment_status?: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status!] || statusConfig.SUBMITTED;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}