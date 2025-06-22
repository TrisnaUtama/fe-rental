import { useAllBooking } from "../../../hooks/useBooking"; 
import { DataTable } from "@/shared/components/table/table";
import { bookingColumns } from "./table/column";
import type { BookingResponse } from "../../../types/booking.type"; 
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { useAuthContext } from "@/shared/context/authContex";

export default function Index() {
  const { accessToken } = useAuthContext();
  const { data, isLoading, isError, error } = useAllBooking(accessToken || "");

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching bookings: {String(error)}</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredBookings = data?.data?.filter((booking) => {
    try {
      const bookingEndDate = new Date(booking.end_date!);
      bookingEndDate.setHours(0, 0, 0, 0);

      return bookingEndDate >= today;
    } catch (e) {
      throw new Error(`Invalid start_date for booking ID: ${booking.id || 'N/A'}, start_date: ${booking.start_date} || ${e}`);
    }
  }) || []; 

  return (
    <div>
      <DataTable<BookingResponse>
        data={filteredBookings} 
        path="/staff/data-destination/create"
        columns={bookingColumns}
        rowIdKey="id"
        hideAddButton={true}
      />
    </div>
  );
}