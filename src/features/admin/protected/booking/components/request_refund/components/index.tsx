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
        const isSubmitted = booking.status === "REFUND_REQUESTED";
        let isStartDateNotPassedToday = false;
        try {
          const bookingStartDate = new Date(booking.start_date);
          bookingStartDate.setHours(0, 0, 0, 0);
          isStartDateNotPassedToday = bookingStartDate >= today;
        } catch (e) {
          isStartDateNotPassedToday = false;
          throw new Error(`Invalid end_date for booking ID: ${booking.id || 'N/A'}, end_date: ${booking.end_date} ${e}`);
        }

        return isSubmitted && isStartDateNotPassedToday;
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