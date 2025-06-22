import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Wallet, Check, X, Car, Info, RefreshCcw, BadgeDollarSign, Loader2 } from "lucide-react";
import type { BookingResponse } from "../../types/booking.type";
import { useGetAllAvailableVehicle } from "@/features/customer/booking/hooks/useBooking";
import { useAuthContext } from "@/shared/context/authContex";
import type { Roles } from "@/shared/enum/enum";

interface AdminActionsSidebarProps {
  booking: BookingResponse;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onAcceptReschedule: (id: string) => void;
  onRejectReschedule: (id: string) => void;
  onAcceptRefund: (id: string) => void;
  onRejectRefund: (id: string) => void;
  onAssignVehicleAndConfirm: (bookingId: string, vehicleIds: string[]) => void;
  onCompleteBooking: (bookingId: string) => void;
}

const ActionSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="pt-4 border-t">
        <p className="text-sm font-semibold text-gray-700 mb-3">{title}</p>
        <div className="space-y-3">{children}</div>
    </div>
);

export const AdminActionsSidebar = ({
  booking, onAccept, onReject, onAcceptReschedule, onRejectReschedule, onAcceptRefund, onRejectRefund, onAssignVehicleAndConfirm, onCompleteBooking,
}: AdminActionsSidebarProps) => {
  const { user } = useAuthContext();
  const userRole = user?.role as Roles;

  const canAcceptRejectBooking = ["SUPERADMIN", "ADMIN_OPERATIONAL"].includes(userRole);
  const canAssignVehicle = ["SUPERADMIN", "ADMIN_OPERATIONAL"].includes(userRole);
  const canHandleReschedule = ["SUPERADMIN", "ADMIN_OPERATIONAL"].includes(userRole);
  const canHandleRefund = ["SUPERADMIN", "ADMIN_FINANCE"].includes(userRole);
  const canCompleteBooking = ["SUPERADMIN", "ADMIN_OPERATIONAL"].includes(userRole);

  const isSubmitted = booking.status === "SUBMITTED";
  const isRescheduleRequested = booking.status === "RESCHEDULE_REQUESTED";
  const isRefundRequested = booking.status === "REFUND_REQUESTED";
  const isCompleteBookingStatus = ["CONFIRMED", "RESCHEDULED"].includes(booking.status!);
  const isTravelPackageNeedingVehicle = isSubmitted && !!booking.travel_package_id && booking.booking_vehicles?.length === 0;

  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const { mutate: fetchAvailableVehicles, data: availableVehiclesData, isPending: isAvailableVehiclesLoading } = useGetAllAvailableVehicle();

  useEffect(() => {
    if (canAssignVehicle && isTravelPackageNeedingVehicle && booking.start_date && booking.end_date) {
      fetchAvailableVehicles({ start_date: booking.start_date, end_date: booking.end_date });
    }
  }, [canAssignVehicle, isTravelPackageNeedingVehicle, booking.start_date, booking.end_date, fetchAvailableVehicles]);

  const handleAssignClick = () => {
    if (selectedVehicles.length === 0) return;
    onAssignVehicleAndConfirm(booking.id, selectedVehicles);
  };
  
  const isEndDateInPast = new Date(booking.end_date!) < new Date();
  const showCompleteBookingButton = isCompleteBookingStatus && isEndDateInPast;

  const showAnyAction =
    (isSubmitted && canAcceptRejectBooking) ||
    (isRescheduleRequested && canHandleReschedule) ||
    (isRefundRequested && canHandleRefund) ||
    (showCompleteBookingButton && canCompleteBooking);

  return (
    <Card className="rounded-2xl shadow-lg border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="w-5 h-5 text-blue-600" />
          Admin Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        {isSubmitted && canAcceptRejectBooking && (
          <ActionSection title="Initial Booking Review">
            {isTravelPackageNeedingVehicle ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Assign Vehicle & Confirm:</p>
                {isAvailableVehiclesLoading ? (
                  <div className="flex items-center justify-center text-gray-500 text-sm gap-2 py-2"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
                ) : (availableVehiclesData?.data && availableVehiclesData.data.length > 0) ? (
                  <Select value={selectedVehicles[0] || ""} onValueChange={(value) => setSelectedVehicles([value])}>
                    <SelectTrigger><SelectValue placeholder="Select a vehicle" /></SelectTrigger>
                    <SelectContent>
                      {availableVehiclesData.data.map(vehicle => (<SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                ) : <p className="text-gray-500 text-sm text-center py-2">No vehicles available.</p>}
                <Button onClick={handleAssignClick} size="lg" className="w-full" disabled={isAvailableVehiclesLoading}><Car className="w-5 h-5 mr-2" />Assign</Button>
                <Button onClick={() => onReject(booking.id)} variant="destructive" size="lg" className="w-full"><X className="w-5 h-5 mr-2" />Reject</Button>
              </div>
            ) : (
              <>
                <Button onClick={() => onAccept(booking.id)} size="lg" className="w-full bg-green-600 hover:bg-green-700"><Check className="w-5 h-5 mr-2" />Accept Booking</Button>
                <Button onClick={() => onReject(booking.id)} variant="destructive" size="lg" className="w-full"><X className="w-5 h-5 mr-2" />Reject Booking</Button>
              </>
            )}
          </ActionSection>
        )}

        {isRescheduleRequested && canHandleReschedule && (
          <ActionSection title="Reschedule Request"><Button onClick={() => onAcceptReschedule(booking.id)} size="lg" className="w-full"><RefreshCcw className="w-5 h-5 mr-2" />Accept</Button><Button onClick={() => onRejectReschedule(booking.id)} variant="destructive" size="lg" className="w-full"><X className="w-5 h-5 mr-2" />Reject</Button></ActionSection>
        )}

        {isRefundRequested && canHandleRefund && (
          <ActionSection title="Refund Request"><Button onClick={() => onAcceptRefund(booking.id)} size="lg" className="w-full"><BadgeDollarSign className="w-5 h-5 mr-2" />Approve</Button><Button onClick={() => onRejectRefund(booking.id)} variant="destructive" size="lg" className="w-full"><X className="w-5 h-5 mr-2" />Reject</Button></ActionSection>
        )}

        {showCompleteBookingButton && canCompleteBooking && (
          <ActionSection title="Booking Completion"><Button onClick={() => onCompleteBooking(booking.id)} size="lg" className="w-full bg-gray-800 hover:bg-gray-900"><Check className="w-5 h-5 mr-2" />Complete Booking</Button></ActionSection>
        )}

        {!showAnyAction && (
          <div className="pt-4 border-t text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg flex items-center gap-2 justify-center">
            <Info className="w-4 h-4 flex-shrink-0" /> No actions available for this booking.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
