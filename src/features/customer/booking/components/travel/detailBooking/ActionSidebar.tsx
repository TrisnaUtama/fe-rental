import { useState, type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Wallet,
  CreditCard,
  RefreshCw,
  Printer,
  Info,
  BadgeDollarSign,
  Hourglass,
  XCircle,
  CheckCircle,
  Send,
  Star,
} from "lucide-react";
import type {
  BookingResponse,
  BookingStatus,
} from "../../../types/booking.type";
import { RescheduleModal } from "../../vehicle/detailBooking/RescheduleModal"; 
import { RequestRefundModal } from "../../vehicle/detailBooking/RequestRefundModal"; 

const formatRupiah = (value: string | number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

const StatusInfoBlock = ({ variant, icon: Icon, title, description }: { variant: 'pending' | 'rejected' | 'success' | 'info', icon: React.ElementType, title: string, description: ReactNode }) => {
  const variantClasses = { pending: 'bg-amber-50 border-amber-200 text-amber-800', rejected: 'bg-red-50 border-red-200 text-red-800', success: 'bg-green-50 border-green-200 text-green-800', info: 'bg-gray-100 border-gray-200 text-gray-800' };
  return (<div className={`p-4 rounded-lg border space-y-2 ${variantClasses[variant]}`}><div className="flex items-center gap-3 font-bold"><Icon className="w-5 h-5" /><h4>{title}</h4></div><p className="text-sm">{description}</p></div>);
};


interface BookingActionsSidebarProps {
  booking: BookingResponse;
  onPayment?: (bookingId: string) => void;
  onRefund?: (bookingId: string) => void;
  onPrint: () => void;
  onGiveRating?: () => void;
}

export function BookingActionsSidebarTravel({ booking, onPayment, onPrint, onGiveRating }: BookingActionsSidebarProps) {
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const { status, pax_option } = booking;
  const bookingStartDate = new Date(booking.start_date);
  const now = new Date();
  const hoursDifference = (bookingStartDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isActionLocked = hoursDifference < 24;

  const renderActionCard = () => {
    switch (status as BookingStatus) {
      case "RECEIVED":
      case "PAYMENT_PENDING":
        return (
          <Card className="border-0 shadow-none">
            <CardHeader><CardTitle className="text-base">Awaiting Payment</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Your travel package booking has been accepted. Please complete the payment to confirm.</p>
              <Button onClick={() => onPayment?.(booking.id)} size="lg" className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold"><CreditCard className="w-5 h-5 mr-2" />Pay Now</Button>
            </CardContent>
          </Card>
        );

      case "CONFIRMED":
      case "RESCHEDULED":
      case "REJECTED_RESHEDULE":
      case "REJECTED_REFUND":
        return (
          <Card className="border-0 shadow-none">
            <CardHeader><CardTitle className="text-base">Manage Your Booking</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {status === 'RESCHEDULED' && <StatusInfoBlock variant="success" icon={CheckCircle} title="Booking Rescheduled" description="Your booking dates have been successfully updated." />}
              {status === 'REJECTED_RESCHEDULE' && <StatusInfoBlock variant="rejected" icon={XCircle} title="Reschedule Rejected" description="Your previous request was not approved. You may submit a new one." />}
              {status === 'REJECTED_REFUND' && <StatusInfoBlock variant="rejected" icon={XCircle} title="Refund Rejected" description="Your request for a refund was not approved. Your booking remains active." />}
              <div className="space-y-3 pt-2">
                <Button onClick={onPrint} size="lg" className="w-full gap-2" variant="outline"><Printer className="w-4 h-4" /> Save Invoice</Button>
                <Button onClick={() => setIsRescheduleModalOpen(true)} disabled={isActionLocked} size="lg" className="w-full gap-2"><RefreshCw className="w-4 h-4" /> Request Reschedule</Button>
                <Button onClick={() => setIsRefundModalOpen(true)} disabled={isActionLocked} size="lg" className="w-full gap-2" variant="destructive">
                  <BadgeDollarSign className="w-4 h-4" /> Request Refund
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "SUBMITTED":
        return <StatusInfoBlock variant="pending" icon={Send} title="Awaiting Admin Confirmation" description="Your booking is being reviewed. You will be notified shortly." />;
      case "RESCHEDULE_REQUESTED":
        return <StatusInfoBlock variant="pending" icon={Hourglass} title="Reschedule Pending" description="Your request is under review. Other actions are disabled." />;
      case "REFUND_REQUESTED":
        return <StatusInfoBlock variant="pending" icon={Hourglass} title="Refund Pending" description="Your request is under review. Other actions are disabled." />;

      case "COMPLETE":
        return (
          <div className="space-y-4 pt-4 border-t">
            <StatusInfoBlock variant="success" icon={CheckCircle} title="Trip Complete" description="We hope you had a wonderful time! Thank you!" />
            <Button onClick={onPrint} size="lg" className="w-full h-12 gap-2"><Printer className="w-4 h-4" /> Save Invoice</Button>
            <Button onClick={onGiveRating} size="lg" className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 font-bold gap-2">
                <Star className="w-5 h-5" /> Give Rating
            </Button>
          </div>
        );

      case "CANCELED":
      case "REJECTED_BOOKING":
      case "REFUNDED":
          const statusText = status!.replace(/_/g, ' ').toLowerCase();
          const isSuccess = status === 'REFUNDED';
          return <div className="pt-4 border-t"><StatusInfoBlock variant={isSuccess ? 'success' : 'rejected'} icon={isSuccess ? CheckCircle : XCircle} title={`Booking ${statusText}`} description="This booking is finalized and no further actions can be taken." /></div>;

      default:
        return <div className="pt-4 border-t"><StatusInfoBlock variant="info" icon={Info} title={`Status: ${status}`} description="Please contact support if you have any questions." /></div>;
    }
  };
  
  return (
    <>
        <div className="lg:sticky lg:top-24">
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Wallet className="w-5 h-5 text-blue-500"/>Payment Summary</h3>
            <div className="space-y-2 pt-2">
                <SummaryRow label="Package Price" value={formatRupiah(pax_option?.price || 0)} />
                <SummaryRow label="Group Size" value={`${pax_option?.pax || 0} People`} />
            </div>
            <div className="border-t pt-4 mt-2">
                <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total Price</span>
                <span className="text-2xl font-extrabold text-blue-600">{formatRupiah(booking.total_price!)}</span>
                </div>
            </div>
            {renderActionCard()}
            </CardContent>
        </Card>
        </div>

        <RescheduleModal isOpen={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)} booking={booking} />
        <RequestRefundModal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} booking={booking} />
    </>
  );
}
