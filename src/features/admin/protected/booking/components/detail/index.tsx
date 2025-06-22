import { useParams } from "react-router-dom";
import { useBookingById } from "../../hooks/useBooking";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { StatusBadge } from "@/features/customer/booking/components/vehicle/list/StatusBadge";
import type {  BookingStatus } from "../../types/booking.type";
import { useAuthContext } from "@/shared/context/authContex";

import { AdminActionsSidebar } from "./AdminActionSidebar";
import { BookingSummaryCard } from "./BookingSummaryCard";
import { CustomerInfo } from "./CustomerInfo";
import { DocumentViewer } from "./DocumentViewer";
import { PaymentInfo } from "./PaymentInfo";
import { VehicleDetailsCard } from "./VehicleCardDetail";
import { RefundRequestDetails } from "./RefundRequestDetails";
import { RescheduleRequestDetails } from "./RescheduleRequestDetail";

interface AdminBookingDetailPageProps {
    onAcceptBooking: (bookingId: string) => void;
    onRejectBooking: (bookingId: string) => void;
    onAcceptReschedule: (rescheduleId: string) => void;
    onRejectReschedule: (rescheduleId: string) => void;
    onAcceptRefund: (refundId: string) => void;
    onRejectRefund: (refundId: string) => void;
    onAssignVehicleAndConfirm: (bookingId: string, vehicleIds: string[]) => void;
    onCompleteBooking: (bookingId:string) => void
}

export default function DetailBookingPage({
    onAcceptBooking,
    onRejectBooking,
    onAcceptReschedule,
    onRejectReschedule,
    onAcceptRefund,
    onRejectRefund,
    onAssignVehicleAndConfirm,
    onCompleteBooking
}: AdminBookingDetailPageProps) {
    const { id } = useParams<{ id: string }>();
    const { accessToken } = useAuthContext();
    const { data: bookingData, isLoading, isError } = useBookingById(id!, accessToken || "");

    if (isLoading) return <LoadingSpinner />;
    if (isError || !bookingData?.data) {
        return <div className="flex h-screen items-center justify-center text-red-600 font-medium">Booking not found or an error occurred.</div>;
    }

    const booking = bookingData.data;

    const latestRefund = booking.Refunds?.filter(r => r.status !== 'CANCEL').pop();
    const latestReschedule = booking.RescheduleRequests?.filter((r:any) => r.status !== 'CANCELED_BY_USER').pop();

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Review Booking by </p>
                            <h1 className="text-3xl font-bold text-gray-900 font-mono">{booking.users?.name}</h1>
                        </div>
                        <StatusBadge status={booking.status as BookingStatus} />
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <main className="lg:col-span-2 space-y-6">
                        
                        {latestRefund && <RefundRequestDetails refund={latestRefund} />}
                        {latestReschedule && <RescheduleRequestDetails request={latestReschedule} originalBooking={booking} />}
                        
                        <BookingSummaryCard booking={booking} />
                        <VehicleDetailsCard booking={booking} />
                        <CustomerInfo booking={booking} />
                        <PaymentInfo booking={booking} />
                        <DocumentViewer booking={booking} />
                    </main>

                    <aside className="lg:sticky lg:top-24">
                        <AdminActionsSidebar
                            booking={booking}
                            onAccept={onAcceptBooking}
                            onReject={onRejectBooking}
                            onAcceptReschedule={onAcceptReschedule}
                            onRejectReschedule={onRejectReschedule}
                            onAcceptRefund={onAcceptRefund}
                            onRejectRefund={onRejectRefund}
                            onAssignVehicleAndConfirm={onAssignVehicleAndConfirm}
                            onCompleteBooking={onCompleteBooking}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}