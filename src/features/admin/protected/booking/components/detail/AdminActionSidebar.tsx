import React, { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Wallet, Check, X, Car, Info, RefreshCcw, BadgeDollarSign } from "lucide-react";
import type { BookingResponse } from "../../types/booking.type";
import { useGetAllAvailableVehicle } from "@/features/customer/booking/hooks/useBooking";

interface AdminActionsSidebarProps {
    booking: BookingResponse;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onAcceptReschedule: (id: string) => void;
    onRejectReschedule: (id: string) => void;
    onAcceptRefund: (id: string) => void;
    onRejectRefund: (id: string) => void;
    onAssignVehicleAndConfirm: (bookingId: string, vehicleIds: string[]) => void;
    onCompleteBooking: (bookingId:string) => void
}

export const AdminActionsSidebar = ({ booking, onAccept, onReject, onAcceptReschedule, onRejectReschedule, onAcceptRefund, onRejectRefund, onAssignVehicleAndConfirm, onCompleteBooking }: AdminActionsSidebarProps) => {
    const isSubmitted = booking.status === "SUBMITTED";
    const isRescheduleRequested = booking.status === "RESCHEDULE_REQUESTED";
    const isRefundRequested = booking.status === "REFUND_REQUESTED";
    const isCompleteBookingStatus = booking.status === "CONFIRMED" || booking.status === "RESCHEDULED";
    const isTravelPackageNeedingVehicle = isSubmitted && !!booking.travel_package_id && booking.booking_vehicles?.length === 0;


    const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
    const { mutate: fetchAvailableVehicles, data: availableVehiclesData, isPending: isAvailableVehiclesLoading } = useGetAllAvailableVehicle();

    React.useEffect(() => {
        if (isTravelPackageNeedingVehicle && booking.start_date && booking.end_date) {
            fetchAvailableVehicles({ start_date: booking.start_date, end_date: booking.end_date });
        }
    }, [isTravelPackageNeedingVehicle, booking.start_date, booking.end_date, fetchAvailableVehicles]);

    const handleAssignClick = () => {
        if (selectedVehicles.length === 0) {
            alert("Please select at least one vehicle to assign.");
            return;
        }
        onAssignVehicleAndConfirm(booking.id, selectedVehicles);
    };

    let isEndDateToday = false;
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (booking.end_date) {
            const bookingEndDate = new Date(booking.end_date);
            bookingEndDate.setHours(0, 0, 0, 0);
            isEndDateToday = bookingEndDate.getTime() === today.getTime();
        }
    } catch (e) {
        console.error(`Invalid end_date for booking ID: ${booking.id || 'N/A'}, end_date: ${booking.end_date}`, e);
        isEndDateToday = false;
    }

    const showCompleteBookingButton = isCompleteBookingStatus && isEndDateToday;

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Wallet className="w-5 h-5 text-blue-500"/>Booking Review Actions</h3>
                <div className="space-y-2 pt-2 text-sm"><p className="text-gray-600">Perform actions based on the current booking status.</p></div>
                {isSubmitted && (
                    <div className="pt-4 border-t space-y-3">
                        <p className="text-sm font-medium text-gray-700">Initial Booking Actions:</p>
                        {!isTravelPackageNeedingVehicle ? (
                           <>
                                <Button onClick={() => onAccept(booking.id)} size="lg" className="w-full h-12 text-base gap-2 bg-green-600 hover:bg-green-700 font-bold"><Check className="w-5 h-5" /> Accept Booking</Button>
                                <Button onClick={() => onReject(booking.id)} variant="destructive" size="lg" className="w-full h-12 text-base gap-2"><X className="w-5 h-5" /> Reject Booking</Button>
                           </>
                        ) : (
                            <p className="text-sm text-center text-gray-500 bg-gray-100 p-3 rounded-lg flex items-center gap-2 justify-center">This travel package needs a vehicle assignment below.</p>
                        )}
                    </div>
                )}
                {isTravelPackageNeedingVehicle && (
                    <div className="pt-4 border-t space-y-3">
                         <p className="text-sm font-medium text-gray-700">Assign Vehicle & Confirm Travel:</p>
                         <div>
                            <label htmlFor="vehicle-select" className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle(s):</label>
                            {isAvailableVehiclesLoading ? <div className="text-gray-500 text-sm">Loading available vehicles...</div> : (availableVehiclesData?.data && availableVehiclesData.data.length > 0) ? (
                                <Select value={selectedVehicles[0] || ""} onValueChange={(value) => setSelectedVehicles([value])}>
                                    <SelectTrigger id="vehicle-select" className="w-full"><SelectValue placeholder="Select a vehicle" /></SelectTrigger>
                                    <SelectContent>{availableVehiclesData.data.map(vehicle => (<SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.name} ({vehicle.transmition})</SelectItem>))}</SelectContent>
                                </Select>
                            ) : <p className="text-gray-500 text-sm">No vehicles available for these dates.</p>}
                         </div>
                        <Button onClick={handleAssignClick} size="lg" className="w-full h-12 text-base gap-2 bg-indigo-600 hover:bg-indigo-700 font-bold" disabled={selectedVehicles.length === 0 || isAvailableVehiclesLoading || !availableVehiclesData?.data?.length}><Car className="w-5 h-5" /> Assign Vehicle & Accept</Button>
                        <Button onClick={() => onReject(booking.id)} variant="destructive" size="lg" className="w-full h-12 text-base gap-2">
                            <X className="w-5 h-5" /> Reject Booking
                        </Button>
                    </div>
                )}
                {isRescheduleRequested && (
                    <div className="pt-4 border-t space-y-3">
                         <p className="text-sm font-medium text-gray-700">Reschedule Request Actions:</p>
                        <Button onClick={() => onAcceptReschedule(booking.id)} size="lg" className="w-full h-12 text-base gap-2 bg-blue-600 hover:bg-blue-700 font-bold"><RefreshCcw className="w-5 h-5" /> Accept Reschedule</Button>
                         <Button onClick={() => onRejectReschedule(booking.id)} variant="destructive" size="lg" className="w-full h-12 text-base gap-2"><X className="w-5 h-5" /> Reject Reschedule</Button>
                    </div>
                )}
                {isRefundRequested && (
                    <div className="pt-4 border-t space-y-3">
                         <p className="text-sm font-medium text-gray-700">Refund Request Actions:</p>
                        <Button onClick={() => onAcceptRefund(booking.id)} size="lg" className="w-full h-12 text-base gap-2 bg-purple-600 hover:bg-purple-700 font-bold"><BadgeDollarSign className="w-5 h-5" /> Approve Refund</Button>
                         <Button onClick={() => onRejectRefund(booking.id)} variant="destructive" size="lg" className="w-full h-12 text-base gap-2"><X className="w-5 h-5" /> Reject Refund</Button>
                    </div>
                )}
                {!isSubmitted && !isRescheduleRequested && !isRefundRequested && !isTravelPackageNeedingVehicle && (
                    <div className="pt-4 border-t"><p className="text-sm text-center text-gray-500 bg-gray-100 p-3 rounded-lg flex items-center gap-2 justify-center"><Info className="w-4 h-4"/> No actions available for this booking status.</p></div>
                )}
               {showCompleteBookingButton && (
                    <div className="pt-4 border-t space-y-3">
                        <p className="text-sm font-medium text-gray-700">Booking Completion:</p>
                        <Button onClick={() => onCompleteBooking(booking.id)} size="lg" className="w-full h-12 text-base gap-2 bg-gray-800 hover:bg-gray-900 font-bold">
                            <Check className="w-5 h-5" /> Complete Booking
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
};