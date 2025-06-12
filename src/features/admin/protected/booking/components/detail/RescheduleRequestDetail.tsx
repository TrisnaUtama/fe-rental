import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {  Hourglass, CheckCircle, XCircle } from "lucide-react";
import type { BookingResponse, RescheduleRequestResponse } from "../../types/booking.type";

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
  </div>
);

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export const RescheduleRequestDetails = ({ request, originalBooking }: { request: RescheduleRequestResponse, originalBooking: BookingResponse }) => {
  const statusConfig = {
    PENDING: { icon: Hourglass, title: 'Pending Reschedule Request', borderColor: 'border-amber-400', textColor: 'text-amber-800' },
    APPROVED: { icon: CheckCircle, title: 'Reschedule Approved', borderColor: 'border-green-500', textColor: 'text-green-800' },
    REJECTED: { icon: XCircle, title: 'Reschedule Rejected', borderColor: 'border-red-500', textColor: 'text-red-800' },
  };

  const currentStatus = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Card className={`rounded-2xl shadow-sm border-l-4 ${currentStatus.borderColor}`}>
      <CardHeader>
        <CardTitle className={`text-xl font-bold flex items-center gap-3 ${currentStatus.textColor}`}>
          <currentStatus.icon className="w-6 h-6" />
          {currentStatus.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        <DetailRow label="Original Dates" value={`${formatDate(originalBooking.start_date)} - ${formatDate(originalBooking.end_date!)}`} />
        <DetailRow label="Requested New Dates" value={`${formatDate(request.new_start_date)} - ${formatDate(request.new_end_date)}`} />
      </CardContent>
    </Card>
  );
};