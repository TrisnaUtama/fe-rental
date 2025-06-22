import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { toast } from "sonner";
import { useCreateRating } from "../hooks/useRating";
import type { RatedEntityType } from "../types/rating.type";

interface UserRatingFormProps {
  userId: string;
  accessToken: string;
  targetId: string;
  ratedType: RatedEntityType;
  onRatingSuccess?: () => void;
}

export function UserRatingForm({
  userId,
  accessToken,
  targetId,
  ratedType,
  onRatingSuccess,
}: UserRatingFormProps) {
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const createRatingMutation = useCreateRating(accessToken);

  const handleStarClick = (value: number) => {
    setRatingValue(value);
  };

  const handleSubmit = async () => {
    if (!userId || !accessToken || !targetId || !ratedType) {
      toast.error("Missing essential data for rating submission.");
      return;
    }
    if (ratingValue === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 5) {
      toast.error("Comment must be at least 5 characters long.");
      return;
    }

    const payload = {
      userId: userId,
      ratedType: ratedType,
      targetId: targetId,
      ratingValue: ratingValue,
      status: true,
      comment: comment.trim(),
    };

    try {
      await createRatingMutation.mutateAsync(payload);
      toast.success("Thank you for your rating!");
      setRatingValue(0);
      setComment("");
      onRatingSuccess?.();
    } catch (error: any) {
      if (error.message && error.message.includes("unique constraint")) {
        toast.error("You have already submitted a rating for this item.");
      } else {
        toast.error(
          error?.message || "Failed to submit rating. Please try again."
        );
      }
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base text-gray-900">
          Give Your Rating
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Please share your feedback by rating and commenting.
        </p>

        <div className="flex items-center gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer transition-colors duration-200
                ${
                  star <= ratingValue
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
                hover:text-yellow-300 hover:fill-yellow-300`}
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Comments:
          </label>
          <textarea
            id="comment"
            placeholder="Tell us about your experience (min 5 characters)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded-lg resize-y min-h-[80px] focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            createRatingMutation.isPending ||
            ratingValue === 0 ||
            comment.trim().length < 5
          }
          size="lg"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold"
        >
          {createRatingMutation.isPending ? "Submitting..." : "Submit Rating"}
        </Button>
      </CardContent>
    </Card>
  );
}
