import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckIcon = () => (
  <svg
    className="w-24 h-24 text-green-500 mx-auto"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Spinner = () => (
  <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin"></div>
);

export default function PaymentFinish() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate(`/car-rental`);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-md w-full">
        <CheckIcon />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 mb-3">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you! Your booking has been confirmed.
        </p>
        <div className="flex items-center justify-center space-x-3">
          <Spinner />
          <p className="text-gray-500">
            You will be redirected to your booking details in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
