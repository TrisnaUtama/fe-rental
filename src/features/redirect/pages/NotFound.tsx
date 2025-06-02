import { Button } from "@/shared/components/ui/button";
import {  useNavigate } from "react-router-dom";


export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
      <Button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
      >
        Back
      </Button>
    </div>
  );
}
