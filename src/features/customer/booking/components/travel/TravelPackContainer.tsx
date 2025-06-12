import { BookingStepper } from "../vehicle/BookingStepper"; 
import { useTravelPackBooking } from "../../context/TravelPackBookingContext";
import { Step2_TravelPackReview } from "./steps/Step2";
import { Step1_TravelPackDocuments } from "./steps/Step1";

const stepLabels = ["Review & Confirm", "Payment"];

export function BookingTravelPackContainer() {
  const { currentStep } = useTravelPackBooking();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BookingStepper currentStep={currentStep} steps={stepLabels} />

      {currentStep === 0 ? <Step1_TravelPackDocuments/>: <Step2_TravelPackReview />}
    </div>
  );
}