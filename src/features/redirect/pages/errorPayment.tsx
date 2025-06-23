import { useNavigate } from 'react-router-dom';

const ErrorIcon = () => (
  <svg
    className="w-24 h-24 text-red-500 mx-auto"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export default function PaymentError() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-md w-full">
        <ErrorIcon />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 mb-3">
          Payment Failed
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          An error occurred while processing your payment. Please try again.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
