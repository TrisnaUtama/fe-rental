import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 text-center">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">Unauthorized Access</h1>
      <p className="mt-2 text-gray-600">
        You don't have permission to view this page. Please contact the
        administrator if you believe this is a mistake.
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate(-1)} variant="outline">
          Return to Home
        </Button>
      </div>
    </div>
  );
}
