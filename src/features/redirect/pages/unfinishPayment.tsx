import { useNavigate } from 'react-router-dom';

// Pending icon component in SVG format
const PendingIcon = () => (
  <svg
    className="w-24 h-24 text-yellow-500 mx-auto"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function PaymentUnfinished() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-md w-full">
        <PendingIcon />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 mb-3">
          Payment Pending
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          We are still waiting for your payment confirmation. If you have already paid, the status will be updated soon.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Return to Order Details
        </button>
      </div>
    </div>
  );
}
