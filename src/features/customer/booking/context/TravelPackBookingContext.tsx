import { createContext, useContext, useState } from "react";
import type { ITravelPack, TravelPax } from "@/features/admin/protected/travel-pack/types/travel-pack";

export interface TravelPackBookingState {
  travelPack?: ITravelPack;
  selectedPax?: TravelPax;
  departureDate?: Date;
  notes?: string;
  
  card_id?: File; 
  licences_id?: File; 
  pick_up_at_airport: boolean; 
  promo_id?: string;
}

interface TravelPackBookingContextType {
  bookingState: TravelPackBookingState;
  setBookingState: React.Dispatch<React.SetStateAction<TravelPackBookingState>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setBookingField: <K extends keyof TravelPackBookingState>(
    field: K,
    value: TravelPackBookingState[K]
  ) => void;
}

const TravelPackBookingContext = createContext<TravelPackBookingContextType | undefined>(undefined);

export const useTravelPackBooking = () => {
  const context = useContext(TravelPackBookingContext);
  if (!context) {
    throw new Error("useTravelPackBooking must be used within a TravelPackBookingProvider");
  }
  return context;
};

export const TravelPackBookingProvider = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: TravelPackBookingState;
}) => {
  const initialState = {
      ...data,
      pick_up_at_airport: false,
  };

  const [bookingState, setBookingState] = useState<TravelPackBookingState>(initialState);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const setBookingField = <K extends keyof TravelPackBookingState>(
    field: K,
    value: TravelPackBookingState[K]
  ) => {
    setBookingState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <TravelPackBookingContext.Provider
      value={{
        bookingState,
        setBookingState,
        currentStep,
        setCurrentStep,
        setBookingField, 
      }}
    >
      {children}
    </TravelPackBookingContext.Provider>
  );
};
