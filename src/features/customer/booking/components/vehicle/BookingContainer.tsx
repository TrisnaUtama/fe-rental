import { BookingStepper } from "./BookingStepper";
import { useBooking } from "../../context/BookingStepperContext";
import Step1VehicleSummary from "./step/Step1Booking";
import Step2RentalInfo from "./step/Step2Booking";

const stepLabels = ["Detail Documents", "Preview and Submit"];

export default function BookingStepsContainer() {
  const { currentStep } = useBooking();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BookingStepper currentStep={currentStep} steps={stepLabels} />

      {currentStep === 0 && <Step1VehicleSummary />}
      {currentStep === 1 && <Step2RentalInfo />}
    </div>
  );
}
