import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
      <Link
        to="/dashboard"
        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
