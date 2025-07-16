import { useAllBooking } from "../../../hooks/useBooking";
import { DataTable } from "@/shared/components/table/table";
import { bookingColumns } from "./table/column";
import type { BookingResponse } from "../../../types/booking.type";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { useAuthContext } from "@/shared/context/authContex";
import { useEffect, useState } from "react";

export default function Index() {
  const { accessToken } = useAuthContext();
  const { data, isLoading, isError, error } = useAllBooking(accessToken || "");
  const [awaitingReview, setAwaitingReview] = useState<BookingResponse[] | undefined>(undefined);

  useEffect(() => {
    if (data?.data) {
      const today = new Date();
	today.setHours(0, 0, 0, 0); 
      const filteredBookings = data.data.filter((booking) => {
        const isStatusRelevant = booking.status === "CONFIRMED" || booking.status === "RESCHEDULED";

        let isEndDateToday = false;
        try {
          if (booking.end_date) {
            const bookingEndDate = new Date(booking.end_date);
            bookingEndDate.setHours(0, 0, 0, 0);

            isEndDateToday = bookingEndDate.getTime() === today.getTime();
          }
        } catch (e) {
          isEndDateToday = false;
          throw new Error(`Invalid end_date for booking ID: ${booking.id || 'N/A'}, end_date: ${booking.end_date} ${e}`);
        }

        return isStatusRelevant && isEndDateToday;
      });

      setAwaitingReview(filteredBookings);
    } else if (!isLoading && !isError) {
      setAwaitingReview([]);
    }
  }, [data, isLoading, isError]);

  if (isLoading || awaitingReview === undefined) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error Booking: {String(error)}</div>;
  }

  return (
    <div>
      <DataTable<BookingResponse>
        data={awaitingReview}
        path="/staff/data-destination/create"
        columns={bookingColumns}
        rowIdKey="id"
        hideAddButton={true}
      />
    </div>
  );
}
