import { BookingProvider } from "../../context/BookingStepperContext";
import BookingStepsContainer from "../../components/vehicle/BookingContainer";
import { useCart } from "@/shared/context/cartContext";
import { formatDate } from "@/shared/utils/format-date";

export default function BookingPage() {
  const { cart } = useCart();

  const bookingDetails = cart.map((item) => ({
    vehicle: item.vehicle,
    dateRange: {
      from: formatDate(item.dateRange.from!) ?? "",
      to: formatDate(item.dateRange.to!) ?? "",
    },
  }));

  const initialBookingState = {
    bookingDetails,
    promoCode: "",
    licences_id: undefined,
    card_id: undefined,
    pick_up_at_airport: false,
    notes: "",
    promo_id: "",
    travel_package_id: "",
    selected_pax: "",
  };

  return (
    <BookingProvider data={initialBookingState}>
      <BookingStepsContainer />
    </BookingProvider>
  );
}
