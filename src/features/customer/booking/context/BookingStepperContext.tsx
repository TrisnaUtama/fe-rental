import { createContext, useContext, useState } from "react";
import type { IVehicle } from "@/features/admin/protected/vehicle/types/vehicle.type"
import type { DateRange } from "react-day-picker";

export interface BookingDetails {
  dateRange: DateRange;
  vehicle: IVehicle;
}

interface BookingState {
  bookingDetails: {
    vehicle: IVehicle;
    dateRange: {
      from: string;
      to: string;
    };
  }[];
  promoCode: string;
  licences_id: File | undefined;
  card_id: File | undefined;
  pick_up_at_airport: boolean;
  notes?: string;
  promo_id?: string;
  travel_package_id?: string;
  selected_pax?: string;
}

interface BookingContextType {
  bookingState: BookingState;
  setBookingState: React.Dispatch<React.SetStateAction<BookingState>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setBookingField: <K extends keyof BookingState>(field: K, value: BookingState[K]) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context)
    throw new Error("useBooking must be used within BookingProvider");
  return context;
};

export const BookingProvider = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: BookingState;
}) => {
  const [bookingState, setBookingState] = useState<BookingState>(data);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const setBookingField = <K extends keyof BookingState>(field: K, value: BookingState[K]) => {
  setBookingState((prev) => ({ ...prev, [field]: value }));
};

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        setBookingState,
        currentStep,
        setCurrentStep,
        setBookingField,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
