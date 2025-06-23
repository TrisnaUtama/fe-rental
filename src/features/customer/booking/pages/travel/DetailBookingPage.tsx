import { useParams, useNavigate } from "react-router-dom";
import { useAllBookingById } from "../../hooks/useBooking";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { DetailBookingTravelPage } from "../../components/travel/detailBooking/DetailBookingComponent"; // Using the Travel component
import { useAuthContext } from "@/shared/context/authContex";
import { MidtransScriptLoader } from "@/shared/components/MidtransLoader";
import { useUpdatePayment } from "../../hooks/usePayment";
import { toast } from "sonner";

export default function DetailBookingPage() {
  const { accessToken } = useAuthContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: bookingData,
    isLoading,
    error: bookingError,
  } = useAllBookingById(id ?? "", accessToken ?? "");
  const { mutateAsync: updatePayment } = useUpdatePayment(accessToken ?? "");
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  const handleBack = () => navigate(-1);

  const openSnapPopup = (snapToken: string) => {
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: (result: any) => {
          toast.success(`Payment Success!`);
          navigate("/payment-finish", {
            state: {
              transactionResult: result,
              bookingId: bookingData?.data.id,
              bookingType: "travel", 
            },
          });
        },
        onPending: (result: any) => {
          toast.warning(`Waiting for payment.`);
          navigate('/payment/pending', {
            state: { transactionResult: result }
          });
        },
        onError: () => {
          toast.error(`Payment failed. Please try again.`);
          navigate('/payment/error');
        },
        onClose: () => {
          toast.info("You closed the payment pop-up.");
        },
      });
    } else {
      toast.error("Midtrans script not loaded. Please refresh the page.");
    }
  };

  const handlePayment = async () => {
    if (!bookingData?.data) {
      toast.error("Booking data is not available.");
      return;
    }

    const paymentInfo = bookingData.data.Payments![0];
    if (!paymentInfo) {
      toast.error("Payment information not found for this booking.");
      return;
    }
    if (!clientKey) {
      toast.error("Payment gateway client key is missing. Contact support.");
      return;
    }
    try {
      const existingToken = paymentInfo.token;
      const tokenExpiry = paymentInfo.expiry_date
        ? new Date(paymentInfo.expiry_date)
        : null;

      if (existingToken && tokenExpiry && tokenExpiry > new Date()) {
        openSnapPopup(existingToken);
        return;
      }
      const response = await updatePayment({ id: id! });
      const newSnapToken = response.data.token;
      if (!newSnapToken) {
        throw new Error("Failed to retrieve Snap token from the server.");
      }
      openSnapPopup(newSnapToken);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error while processing payment.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (bookingError) {
    toast.error("Failed to load booking details.");
    return <LoadingSpinner />;
  }
  if (!bookingData?.data) return <LoadingSpinner />;

  return (
    <>
      <MidtransScriptLoader clientKey={clientKey} />
      <DetailBookingTravelPage
        booking={bookingData.data}
        onBack={handleBack}
        onPayment={handlePayment}
      />
    </>
  );
}