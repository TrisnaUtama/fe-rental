import { useState, useRef } from 'react';
import { BookingDetailHeaderTravel } from './Header';
import { BookingInfoCard } from './InfoCard';
import { InvoiceReceiptTravel } from './InvoiceRecepient';
import { BookingActionsSidebarTravel } from './ActionSidebar';
import { RequestStatusCard } from "../../vehicle/list/RequestStatusCard";
import type { BookingResponse } from "../../../types/booking.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { TravelPackageRatingForm } from "@/features/customer/rating/components/travelPackRatingForm";


interface DetailBookingTravelPageProps {
    booking: BookingResponse;
    onBack: () => void;
    onPayment?: (bookingId: string) => void;
    onRefund?: (bookingId: string) => void;
}

export function DetailBookingTravelPage({ booking, onBack, onPayment, onRefund }: DetailBookingTravelPageProps) {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const showInvoice =
    booking.status === "CONFIRMED" ||
    booking.status === "COMPLETE" ||
    booking.status === "REFUND_REQUESTED" || 
    booking.status === "REJECTED_REFUND" ||
    booking.status === "RESCHEDULED" ||
    booking.status === "REFUNDED";

  const handlePrintInvoice = () => {
     if (!invoiceRef.current) return;
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const latestRescheduleRequest = booking.RescheduleRequests?.slice(-1)[0];
  const latestRefundRequest = booking.Refunds?.slice(-1)[0];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media print { 
          body > * { 
            visibility: hidden !important; 
          } 
          #invoice-section, #invoice-section * { 
            visibility: visible !important; 
          } 
          #invoice-section { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            margin: 0; 
            padding: 0; 
            box-shadow: none !important; 
            border: none !important;
          } 
        }`}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <BookingDetailHeaderTravel booking={booking} onBack={onBack} />

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2 space-y-6">
            {latestRescheduleRequest && (
              <RequestStatusCard
                request={latestRescheduleRequest}
                type="reschedule"
                originalBooking={{
                  start_date: booking.start_date,
                  end_date: booking.end_date ?? null,
                }}
              />
            )}
            {latestRefundRequest && (
              <RequestStatusCard
                request={latestRefundRequest}
                type="refund"
                originalBooking={{
                  start_date: booking.start_date,
                  end_date: booking.end_date ?? null,
                }}
              />
            )}
            <BookingInfoCard booking={booking} />
            {showInvoice && 
                <div ref={invoiceRef} id="invoice-section">
                    <InvoiceReceiptTravel booking={booking} />
                </div>
            }
          </main>

          <aside>
            <BookingActionsSidebarTravel
              booking={booking}
              onPayment={onPayment}
              onRefund={onRefund}
              onPrint={handlePrintInvoice}
              onGiveRating={() => setIsRatingModalOpen(true)}
            />
          </aside>
        </div>
      </div>
      
      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Rate Your Trip Experience</DialogTitle>
                <DialogDescription>
                    Your detailed feedback helps us and other travelers. Thank you!
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <TravelPackageRatingForm booking={booking} />
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
