import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { differenceInCalendarDays } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { DatePickerWithRange } from "@/shared/components/ui/calender-range";
import {
  useGetUnavailableDates,
  useRequestReschedule,
} from "../../../hooks/useBooking";
import type { BookingResponse } from "../../../types/booking.type";
import { useAuthContext } from "@/shared/context/authContex";
import { formatDate } from "@/shared/utils/format-date";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingResponse | null;
}

export function RescheduleModal({
  isOpen,
  onClose,
  booking,
}: RescheduleModalProps) {
  const [newDateRange, setNewDateRange] = useState<DateRange | undefined>();
  const { accessToken } = useAuthContext();

  const { mutateAsync: requestReschedule, isPending: isRequesting } =
    useRequestReschedule(accessToken || "");

  const vehicleIds = useMemo(() => {
    if (!isOpen || !booking?.booking_vehicles) {
      return null;
    }
    return booking.booking_vehicles.map((bv) => bv.vehicle.id);
  }, [isOpen, booking]);

  const bookingIdToExclude = isOpen ? booking?.id ?? null : null;
  const {
    data: unavailableDates,
    isLoading,
    isError,
    error,
  } = useGetUnavailableDates(vehicleIds, bookingIdToExclude, accessToken);

  if (!isOpen || !booking) {
    return null;
  }

  const originalDuration =
    differenceInCalendarDays(
      new Date(booking.end_date!),
      new Date(booking.start_date)
    ) + 1;

  const handleConfirmReschedule = async () => {
    if (!newDateRange?.from || !newDateRange?.to || !booking.id) {
      toast.error("Please select a valid new date range.");
      return;
    }

    try {
      const payload = {
        new_start_date: formatDate(newDateRange.from),
        new_end_date: formatDate(newDateRange.to),
      };
      await requestReschedule({
        bookingId: booking.id,
        data: payload,
      });
      toast.success("Reschedule request submitted successfully!");
      onClose();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error";
      toast.error(`Failed to submit request: ${errorMessage}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Reschedule</DialogTitle>
          <DialogDescription>
            Select a new date range for your booking. The new booking must be
            for the same duration of **{originalDuration} day(s)**.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center gap-4">
          {isLoading && (
            <p className="text-sm text-gray-500">
              Loading vehicle availability...
            </p>
          )}
          {isError && (
            <p className="text-sm text-red-600">Error: {error.message}</p>
          )}
          {unavailableDates && (
            <DatePickerWithRange
              value={newDateRange}
              onChange={setNewDateRange}
              disabledDates={unavailableDates}
              fixedDuration={originalDuration}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReschedule}
            disabled={
              !newDateRange?.from || isLoading || isError || isRequesting
            }
          >
            {isRequesting ? "Submitting..." : "Confirm Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
