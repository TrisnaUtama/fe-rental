import { Check } from "lucide-react";

export const BookingStepper = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: string[];
}) => {
  return (
    <div className="w-full mb-8 lg:mb-12">
      {/* Mobile Stepper */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep]}</h2>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                    ${index <= currentStep
                      ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200"
                      : "border-gray-300 text-gray-400 bg-white"
                    }
                  `}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center max-w-32">
                  <span
                    className={`text-sm font-medium block ${
                      index <= currentStep ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-16 lg:w-24 h-0.5 mx-4 transition-all duration-500
                    ${index < currentStep ? "bg-blue-500" : "bg-gray-300"}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};