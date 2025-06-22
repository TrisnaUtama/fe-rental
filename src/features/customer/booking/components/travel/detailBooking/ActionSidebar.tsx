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
  ChevronRight,
} from "lucide-react";
import type {
  BookingResponse,
  BookingStatus,
} from "../../../types/booking.type";
import { RescheduleModal } from "../../vehicle/detailBooking/RescheduleModal";
import { RequestRefundModal } from "../../vehicle/detailBooking/RequestRefundModal";
import { motion } from "framer-motion"; 

const formatRupiah = (value: string | number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));

const SummaryRow = ({ label, value, isDiscount = false, isTotal = false }: { label: string; value: string; isDiscount?: boolean; isTotal?: boolean; }) => (
  <div className={`flex justify-between items-baseline ${isTotal ? 'text-lg' : 'text-sm'}`}>
    <span className={`font-semibold ${isTotal ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
    <span className={`font-bold ${isDiscount ? 'text-green-600' : isTotal ? 'text-blue-600 text-xl' : 'text-gray-800'}`}>
      {value}
    </span>
  </div>
);

const StatusInfoBlock = ({ variant, icon: Icon, title, description }: { variant: 'pending' | 'rejected' | 'success' | 'info', icon: React.ElementType, title: string, description: ReactNode }) => {
  const variantClasses = { pending: 'bg-amber-50 border-amber-200 text-amber-800', rejected: 'bg-red-50 border-red-200 text-red-800', success: 'bg-green-50 border-green-200 text-green-800', info: 'bg-gray-100 border-gray-200 text-gray-800' };
  return (<div className={`p-4 rounded-lg border space-y-2 ${variantClasses[variant]}`}><div className="flex items-center gap-3 font-bold"><Icon className="w-5 h-5" /><h4>{title}</h4></div><p className="text-sm">{description}</p></div>);
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, 
    },
  },
};

const listItemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const ActionListItem = ({ icon: Icon, title, description, onClick, disabled = false, variant = 'default' }: { icon: React.ElementType, title: string, description: string, onClick: () => void, disabled?: boolean, variant?: "default" | "destructive" }) => (
  <motion.li variants={listItemVariants}>
    <button onClick={onClick} disabled={disabled} className="flex items-center w-full text-left p-3 -m-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
      <div className={`mr-4 h-10 w-10 flex items-center justify-center rounded-lg ${variant === 'destructive' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {!disabled && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </button>
  </motion.li>
);

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

  const { status, pax_option, promos } = booking;
  const bookingStartDate = new Date(booking.start_date);
  const now = new Date();
  const hoursDifference = (bookingStartDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isActionLocked = hoursDifference < 24;

  const subtotal = Number(pax_option?.price || 0);
  const discountAmount = promos ? subtotal - Number(booking.total_price) : 0;

  const ActionCard = () => {
    switch (status as BookingStatus) {
      case "RECEIVED":
      case "PAYMENT_PENDING":
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle className="text-base">Awaiting Payment</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Your travel package booking has been accepted. Please complete the payment to confirm.</p>
              <div className="hidden lg:block">
                <Button onClick={() => onPayment?.(booking.id)} size="lg" className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold"><CreditCard className="w-5 h-5 mr-2" />Pay Now</Button>
              </div>
            </CardContent>
          </Card>
        );

      case "CONFIRMED":
      case "RESCHEDULED":
      case "REJECTED_RESHEDULE":
      case "REJECTED_REFUND":
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle className="text-base">Manage Your Booking</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {isActionLocked && <StatusInfoBlock variant="info" icon={Info} title="Actions Locked" description="Reschedule and refund are unavailable within 24 hours of departure." />}
              {status === 'RESCHEDULED' && <StatusInfoBlock variant="success" icon={CheckCircle} title="Booking Rescheduled" description="Your booking dates have been successfully updated." />}
              {status === 'REJECTED_RESHEDULE' && <StatusInfoBlock variant="rejected" icon={XCircle} title="Reschedule Rejected" description="Your previous request was not approved." />}
              {status === 'REJECTED_REFUND' && <StatusInfoBlock variant="rejected" icon={XCircle} title="Refund Rejected" description="Your request for a refund was not approved." />}
              
              <motion.ul 
                className="space-y-2 pt-2"
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <ActionListItem icon={Printer} title="Save Invoice" description="Download or print your booking invoice" onClick={onPrint} />
                <ActionListItem icon={RefreshCw} title="Request Reschedule" description="Change your travel dates" onClick={() => setIsRescheduleModalOpen(true)} disabled={isActionLocked} />
                <ActionListItem icon={BadgeDollarSign} title="Request Refund" description="Cancel your booking and request a refund" onClick={() => setIsRefundModalOpen(true)} disabled={isActionLocked} variant="destructive" />
              </motion.ul>
            </CardContent>
          </Card>
        );
      
      case "COMPLETE":
        return (
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle className="text-base">Trip Complete!</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <StatusInfoBlock variant="success" icon={CheckCircle} title="We hope you had a wonderful time!" description="Your feedback is valuable to us and other travelers." />
              <Button onClick={onPrint} size="lg" className="w-full gap-2" variant="outline"><Printer className="w-4 h-4" /> Save Invoice</Button>
              <div className="hidden lg:block">
                <Button onClick={onGiveRating} size="lg" className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 font-bold gap-2">
                    <Star className="w-5 h-5" /> Give Rating
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
      case "CANCELED":
      case "REJECTED_BOOKING":
      case "REFUNDED":
          const statusText = status!.replace(/_/g, ' ').toLowerCase();
          const isSuccess = status === 'REFUNDED';
          return <StatusInfoBlock variant={isSuccess ? 'success' : 'rejected'} icon={isSuccess ? CheckCircle : XCircle} title={`Booking ${statusText}`} description="This booking is finalized and no further actions can be taken." />;
      default:
        return <StatusInfoBlock variant="info" icon={Info} title={`Status: ${status}`} description="Please contact support if you have any questions." />;
    }
  };

  const PaymentSummaryCard = () => (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4"><Wallet className="w-5 h-5 text-blue-500"/>Payment Summary</h3>
        <div className="space-y-3">
          {promos ? (
              <>
                <SummaryRow label="Subtotal" value={formatRupiah(subtotal)} />
                <SummaryRow label={`Promo Applied (${promos.code})`} value={`-${formatRupiah(discountAmount)}`} isDiscount={true} />
              </>
            ) : (
              <>
                <SummaryRow label="Package Price" value={formatRupiah(pax_option?.price || 0)} />
                <SummaryRow label="Group Size" value={`${pax_option?.pax || 0} People`} />
              </>
            )}
            <div className="border-t pt-3 mt-3">
              <SummaryRow label="Total Price" value={formatRupiah(booking.total_price!)} isTotal={true} />
            </div>
        </div>
      </CardContent>
    </Card>
  );

  const StickyMobileActions = () => {
    const showPayButton = status === "RECEIVED" || status === "PAYMENT_PENDING";
    const showRatingButton = status === "COMPLETE";

    if (!showPayButton && !showRatingButton) return null;

    return (
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-sm border-t z-10">
        {showPayButton && (
          <Button onClick={() => onPayment?.(booking.id)} size="lg" className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold">
            <CreditCard className="w-5 h-5 mr-2" />Pay Now
          </Button>
        )}
         {showRatingButton && (
           <Button onClick={onGiveRating} size="lg" className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 font-bold gap-2">
              <Star className="w-5 h-5" /> Give Rating
            </Button>
         )}
      </div>
    );
  }
  
  return (
    <>
      <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
        <PaymentSummaryCard />
        <ActionCard />
      </div>
      <div className="lg:hidden space-y-6">
         <PaymentSummaryCard />
         <ActionCard />
      </div>
      <StickyMobileActions />
      <RescheduleModal isOpen={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)} booking={booking} />
      <RequestRefundModal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} booking={booking} />
    </>
  );
}