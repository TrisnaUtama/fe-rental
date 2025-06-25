import { useParams, useNavigate } from "react-router-dom";
import { useAllBookingById } from "../../hooks/useBooking";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { DetailBookingTravelPage } from "../../components/travel/detailBooking/DetailBookingComponent";
import { useAuthContext } from "@/shared/context/authContex";
import { MidtransTrigger } from "@/shared/components/MidtransLoader";
import { useUpdatePayment } from "../../hooks/usePayment";
import { toast } from "sonner";
import { useState } from "react";

export default function DetailBookingPage() {
  const { accessToken } = useAuthContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [snapToken, setSnapToken] = useState<string | null>(null);

  const {
    data: bookingData,
    isLoading,
    error: bookingError,
  } = useAllBookingById(id ?? "", accessToken ?? "");
  const { mutateAsync: updatePayment } = useUpdatePayment(accessToken ?? "");
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  const handleBack = () => navigate("/list-booking-travel");

  const handlePayment = async () => {
    if (!bookingData?.data) {
      toast.error("Booking data is not available.");
      return;
    }

    const paymentInfo = bookingData.data.Payments?.[0];
    if (!paymentInfo) {
      toast.error("Payment information not found.");
      return;
    }

    try {
      const tokenExpiry = paymentInfo.expiry_date
        ? new Date(paymentInfo.expiry_date)
        : null;

      if (paymentInfo.token && tokenExpiry && tokenExpiry > new Date()) {
        setSnapToken(paymentInfo.token); 
        return;
      }

      const response = await updatePayment({ id: id! });
      const newSnapToken = response.data.token;

      if (!newSnapToken) {
        throw new Error("Failed to retrieve Snap token.");
      }

      setSnapToken(newSnapToken);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error processing payment.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (bookingError) {
    toast.error("Failed to load booking.");
    return <LoadingSpinner />;
  }

  return (
    <>
      {snapToken && (
        <MidtransTrigger
          clientKey={clientKey}
          transactionToken={snapToken}
          onSuccess={(result) => {
            toast.success("Payment success!");
            navigate("/payment-finish", {
              state: {
                transactionResult: result,
                bookingId: bookingData?.data.id,
                bookingType: "travel",
              },
            });
          }}
          onPending={(result) => {
            toast.warning("Payment pending.");
            navigate("/payment/pending", {
              state: { transactionResult: result },
            });
          }}
          onError={() => {
            toast.error("Payment error.");
            navigate("/payment/error");
          }}
          onClose={() => {
            toast.info("Payment popup closed.");
          }}
        />
      )}
      <DetailBookingTravelPage
        booking={bookingData!.data}
        onBack={handleBack}
        onPayment={handlePayment}
      />
    </>
  );
}
