import { useLocation } from "react-router-dom";
import { TravelPackBookingProvider } from "@/features/customer/booking/context/TravelPackBookingContext"
import { BookingTravelPackContainer } from "@/features/customer/booking/components/travel/TravelPackContainer";
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function BookingTravelPackPage() {
  const location = useLocation();
  const initialState = location.state;

  if (!initialState?.travelPack) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner/>
      </div>
    );
  }

  return (
    <TravelPackBookingProvider data={initialState}>
      <BookingTravelPackContainer />
    </TravelPackBookingProvider>
  );
}