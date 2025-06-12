import { CheckCircle, Car } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

export default function BookingSuccess() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

   const location = useLocation();

  const bookingListPath =
    location.state?.bookingType === "travel"
      ? "/list-booking-travel"
      : "/list-booking-vehicle";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Animation */}
        <div className="relative">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div className="relative inline-block">
              {/* Animated background circle */}
              <div
                className={`absolute inset-0 bg-blue-100 rounded-full transition-all duration-1000 delay-300 ${
                  isVisible ? "scale-150 opacity-30" : "scale-100 opacity-0"
                }`}
              />
              <div
                className={`absolute inset-0 bg-blue-200 rounded-full transition-all duration-800 delay-500 ${
                  isVisible ? "scale-125 opacity-40" : "scale-100 opacity-0"
                }`}
              />

              {/* Main success icon */}
              <div className="relative bg-blue-500 rounded-full p-6 shadow-lg">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>

              {/* Floating car icon */}
              <div
                className={`absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md transition-all duration-1000 delay-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`space-y-6 transition-all duration-800 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Main headline */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Booking Successful!</h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full" />
          </div>

          {/* Subtext */}
          <p className="text-lg text-gray-700 leading-relaxed">
            Thank you for your booking. Please wait for confirmation from our staff.
          </p>

          {/* Additional message */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-blue-100 shadow-sm">
            <p className="text-gray-600 leading-relaxed">
              You can check your booking details periodically to see if it has been approved and proceed to payment when
              available.
            </p>
          </div>

          {/* Action button */}
          <div
            className={`transition-all duration-600 delay-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Link
              to={bookingListPath}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-full"
            >
              View My Bookings
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-4 w-16 h-16 bg-blue-300/20 rounded-full blur-lg" />
      </div>
    </div>
  )
}
