import { useRef, useState } from "react";
import { BookingDetailHeader } from "./Header";
import { BookingInfoCard } from "./InfoCard";
import { InvoiceReceipt } from "./InvoiceRecepient";
import { BookingActionsSidebar } from "./ActionSidebar";
import { RequestStatusCard } from "../list/RequestStatusCard";
import type { BookingResponse } from "../../../types/booking.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { VehicleRatingItem } from "@/features/customer/rating/components/VehicleRatingForm";

interface BookingDetailPageProps {
  booking: BookingResponse;
  onBack: () => void;
  onPayment?: (bookingId: string) => void;
  onRefund?: (bookingId: string) => void;
}

export function BookingDetailPage({
  booking,
  onBack,
  onPayment,
  onRefund,
}: BookingDetailPageProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const showInvoice =
    booking.status === "CONFIRMED" ||
    booking.status === "COMPLETE" ||
    booking.status === "REFUND_REQUESTED" ||
    booking.status === "REJECTED_REFUND" ||
    booking.status === "REFUNDED";

  const handlePrintInvoice = () => {
    if (!invoiceRef.current) return;

    invoiceRef.current.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const days =
    Math.ceil(
      Math.abs(
        new Date(booking.end_date!).getTime() -
          new Date(booking.start_date).getTime()
      ) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  const latestRescheduleRequest = booking.RescheduleRequests?.slice(-1)[0];
  const latestRefundRequest = booking.Refunds?.slice(-1)[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }

            #invoice-print-section, #invoice-print-section * {
              visibility: visible !important;
            }

            #invoice-print-section {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              background: white;
              padding: 2rem;
              z-index: 9999;
            }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <BookingDetailHeader booking={booking} onBack={onBack} />

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

            {showInvoice && (
              <div ref={invoiceRef} id="invoice-print-section">
                <InvoiceReceipt booking={booking} />
              </div>
            )}
          </main>

          <aside>
            <BookingActionsSidebar
              booking={booking}
              days={days}
              onPayment={onPayment}
              onRefund={onRefund}
              onPrint={handlePrintInvoice}
              onGiveRating={() => setIsRatingModalOpen(true)}
            />
          </aside>
        </div>
      </div>

      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              Your feedback helps us improve. Please rate each vehicle you used
              during this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {booking.booking_vehicles && booking.booking_vehicles.length > 0 ? (
              booking.booking_vehicles.map((bookingVehicle) => (
                <VehicleRatingItem
                  key={bookingVehicle.vehicle.id}
                  bookingVehicle={bookingVehicle}
                />
              ))
            ) : (
              <p className="text-sm text-center text-gray-500">
                No vehicles found in this booking to rate.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}