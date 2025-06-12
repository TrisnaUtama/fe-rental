import { useAllBooking } from "../../../hooks/useBooking"; // Assuming this path is correct
import { DataTable } from "@/shared/components/table/table"; // Assuming this path is correct
import { bookingColumns } from "./table/column"; // Assuming this path is correct
import type { BookingResponse } from "../../../types/booking.type"; // Assuming this path is correct
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
      console.error(`Invalid start_date for booking ID: ${booking.id || 'N/A'}, start_date: ${booking.start_date}`, e);
      return false; 
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