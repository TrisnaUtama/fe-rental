import { useState } from "react";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import DetailBookingPage from "../components/detail";
import { TreePalm, Pencil } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateBooking, useBookingById } from "../hooks/useBooking";
import { useAuthContext } from "@/shared/context/authContex";
import { toast } from "sonner";
import type { BookingStatus, RefundResponse, ApproveRefundPayload, RejectRefundPayload } from "../types/booking.type";

import { useAssignVehicleAndConfirmBooking } from "../hooks/useBooking";
import { useApproveRefund, useRejectRefund } from "../hooks/useRefund";

import { ApproveRefundModal } from "../components/detail/ApproveRefundModal";
import { RejectRefundModal } from "../components/detail/RejectModalRefund"; 

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();

  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundResponse | null>(null);

  const { data: dataBooking, isLoading: isBookingDataLoading } = useBookingById(
    id!,
    accessToken || ""
  );

  const { mutateAsync: approveRefund, isPending: isApproving } = useApproveRefund(accessToken || "");
  const { mutateAsync: rejectRefund, isPending: isRejecting } = useRejectRefund(accessToken || "");
  
  const { mutateAsync: updateBooking } = useUpdateBooking(accessToken || "");
  const { mutateAsync: assignVehicle } = useAssignVehicleAndConfirmBooking(
    accessToken || ""
  );


  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: BookingStatus,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!bookingId) {
      toast.error("Booking ID is missing.");
      return;
    }
    if (!accessToken) {
      toast.error("Authentication token is missing. Please log in.");
      return;
    }
    if (isBookingDataLoading || !dataBooking?.data) {
      toast.info(
        "Booking data is still loading or not available. Please wait."
      );
      return;
    }

    try {
      const currentBooking = dataBooking.data;

      const payload = {
        start_date: currentBooking.start_date,
        end_date: currentBooking.end_date,
        notes: currentBooking.notes || "",
        pick_up_at_airport: currentBooking.pick_up_at_airport,
        promo_id: currentBooking.promo_id || "",
        travel_package_id: currentBooking.travel_package_id || "",
        pax_option_id: currentBooking.pax_option?.id || "",
        vehicle_ids:
          currentBooking.booking_vehicles?.map((bv) => bv.vehicle_id) || [],
        status: newStatus,
        card_id: currentBooking.card_id,
        licences_id: currentBooking.licences_id,
      };
      await updateBooking({
        id: bookingId,
        data: payload,
      });
      toast.success(successMessage);
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      toast.error(`${errorMessage}: ${apiErrorMessage}`);
      console.error(errorMessage, error);
    }
  };

  const handleAssignVehicleAndConfirm = async (
    bookingId: string,
    vehicleIds: string[]
  ) => {
    if (!bookingId || vehicleIds.length === 0) {
      toast.error("Booking ID or vehicle IDs are missing.");
      return;
    }
    if (!accessToken) {
      toast.error("Authentication token is missing. Please log in.");
      return;
    }

    try {
      await assignVehicle({
        id: bookingId,
        data: { vehicle_ids: vehicleIds },
      });
      toast.success(
        `Vehicles assigned and booking ${bookingId} confirmed successfully!`
      );
    } catch (error: any) {
      toast.error(
        `Failed to assign vehicle: ${error.message || "Unknown error"}`
      );
      console.error("Failed to assign vehicle", error.message);
    }
  };

  const handleAcceptBooking = (bookingId: string) => {
    handleUpdateStatus(
      bookingId,
      "RECEIVED",
      `Booking ${bookingId} accepted successfully!`,
      `Failed to accept booking ${bookingId}`
    );
    navigate(-1);
  };

  const handleRejectBooking = (bookingId: string) => {
    handleUpdateStatus(
      bookingId,
      "REJECTED_BOOKING",
      `Booking ${bookingId} rejected!`,
      `Failed to reject booking ${bookingId}`
    );
    navigate(-1);
  };

  const handleAcceptReschedule = (bookingId: string) => {
    handleUpdateStatus(
      bookingId,
      "RESCHEDULED",
      `Reschedule for Booking ${bookingId} accepted!`,
      `Failed to accept reschedule for booking ${bookingId}`
    );
    navigate(-1);
  };

  const handleRejectReschedule = (bookingId: string) => {
    handleUpdateStatus(
      bookingId,
      "REJECTED_RESHEDULE",
      `Reschedule for Booking ${bookingId} rejected!`,
      `Failed to reject reschedule for booking ${bookingId}`
    );
    navigate(-1);
  };
  const handleCompleteBooking = (bookingId: string) => {
    handleUpdateStatus(
      bookingId,
      "COMPLETE",
      `Booking with id ${bookingId} is complete`,
      `Failed to complete booking ${bookingId}`
    );
    navigate(-1);
  };

  const handleOpenApproveModal = () => {
    const pendingRefund = dataBooking?.data?.Refunds?.find(r => r.status === 'PENDING');
    if (pendingRefund) {
      setSelectedRefund(pendingRefund);
      setApproveModalOpen(true);
    } else {
      toast.warning("No pending refund request found for this booking.");
    }
  };

  const handleOpenRejectModal = () => {
     const pendingRefund = dataBooking?.data?.Refunds?.find(r => r.status === 'PENDING');
    if (pendingRefund) {
      setSelectedRefund(pendingRefund);
      setRejectModalOpen(true);
    } else {
      toast.warning("No pending refund request found for this booking.");
    }
  };

  const handleConfirmApproval = async (payload: ApproveRefundPayload) => {
    if (!selectedRefund) return;
    try {
      await approveRefund({ refundId: selectedRefund.id, data: payload });
      toast.success("Refund has been approved and processed successfully.");
      setApproveModalOpen(false); 
      navigate(-1);
    } catch (error: any) {
      toast.error(`Failed to approve refund: ${error.message || 'Unknown error'}`);
    }
  };

  const handleConfirmRejection = async (payload: RejectRefundPayload) => {
     if (!selectedRefund) return;
    try {
      console.log(selectedRefund.id);
      const data = await rejectRefund({ refundId: selectedRefund.id, data: payload });
      console.log(data.message);
      toast.success("Refund request has been successfully rejected.");
      setRejectModalOpen(false); 
      navigate(-1);
    } catch (error: any) {
      toast.error(`Failed to reject refund: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          {
            title: "Bookings",
            href: "/staff/bookings/all",
            icon: <TreePalm className="h-4 w-4" />,
          },
          {
            title: "Review Booking",
            href: `/staff/bookings/${id}`,
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <DetailBookingPage
        onAcceptBooking={handleAcceptBooking}
        onRejectBooking={handleRejectBooking}
        onAcceptReschedule={handleAcceptReschedule}
        onRejectReschedule={handleRejectReschedule}
        onAcceptRefund={handleOpenApproveModal}
        onRejectRefund={handleOpenRejectModal}
        onAssignVehicleAndConfirm={handleAssignVehicleAndConfirm}
        onCompleteBooking={handleCompleteBooking}
      />

      {selectedRefund && (
        <>
          <ApproveRefundModal
            isOpen={isApproveModalOpen}
            onClose={() => setApproveModalOpen(false)}
            refund={selectedRefund}
            onConfirm={handleConfirmApproval}
            isProcessing={isApproving} 
          />
          <RejectRefundModal
            isOpen={isRejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            refund={selectedRefund}
            onConfirm={handleConfirmRejection}
            isProcessing={isRejecting}
          />
        </>
      )}
    </div>
  );
}