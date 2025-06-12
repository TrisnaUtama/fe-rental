import { useState, useEffect } from "react";
import { useAuthContext } from "@/shared/context/authContex";
import { useGetRatingByTargetId } from "@/features/customer/rating/hooks/useRating";
import { UserRatingForm } from "@/features/customer/rating/components/RatingCard";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

interface Destination {
  id: string;
  name: string;
}

interface DestinationRatingItemProps {
  destination: Destination;
}

export function DestinationRatingItem({ destination }: DestinationRatingItemProps) {
  const { user, accessToken } = useAuthContext();
  const [hasRated, setHasRated] = useState(false);

  const destinationId = destination.id;
  const currentUserId = user?.id ?? "";
  const currentAccessToken = accessToken ?? "";

  const { data: existingRatings, isLoading } = useGetRatingByTargetId(
    destinationId, 
    currentAccessToken,
    { enabled: !!destinationId && !!currentAccessToken } 
  );

  useEffect(() => {
    if (existingRatings?.data && currentUserId) {
      const userHasRated = existingRatings.data.some(
        (rating) => rating.userId === currentUserId
      );
      setHasRated(userHasRated);
    }
  }, [existingRatings, currentUserId]);

  if (isLoading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">Loading rating status for {destination.name}...</span>
      </Card>
    );
  }

  if (hasRated) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">{destination.name}</p>
            <p className="text-sm text-green-700">Thank you for your feedback!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border rounded-xl p-2 bg-white">
       <h4 className="font-semibold text-center text-gray-800 mb-2">
         Rate Your Experience at: <br/> <span className="text-blue-600">{destination.name}</span>
       </h4>
      <UserRatingForm
        userId={currentUserId}
        accessToken={currentAccessToken}
        targetId={destinationId} 
        ratedType={"DESTINATION"}
        onRatingSuccess={() => {
          setHasRated(true); 
        }}
      />
    </div>
  );
}
