import { useParams, useNavigate } from "react-router-dom";
import { useAllBookingById } from "../../hooks/useBooking";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { BookingDetailPage } from "../../components/vehicle/detailBooking/DetailBookingComponent";
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

  const handlePayment = async () => {
    if (!id || !accessToken) {
      toast.error("Invalid booking or user session. Please login again.");
      return;
    }

    if (!clientKey) {
      toast.error("Payment gateway client key is missing. Contact support.");
      return;
    }

    try {
      const response = await updatePayment({id:id});
      const snapToken = response.data.token;
      if (!snapToken) {
        throw new Error("Snap token is not available.");
      }
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: (result) => {
            toast.success(`Pembayaran berhasil!, ${result}`);
            navigate("/payment/finish");
          },
          onPending: (result) => {
            toast.warning(`Pembayaran tertunda. ${result}`);
            navigate("/payment/unfinish");
          },
          onError: (error) => {
            toast.error(`Terjadi kesalahan dalam proses pembayaran. ${error}`);
            navigate("/payment/error");
          },
          onClose: () => {
            toast.warning("Popup pembayaran ditutup tanpa konfirmasi.");
            navigate("/payment/unfinish");
          },
        });
      } else {
        throw new Error("Midtrans Snap script is not loaded.");
      }
    } catch (error: any) {
      toast.error(
        error?.message || "Terjadi kesalahan saat proses pembayaran."
      );
      console.error("Payment processing error:", error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (bookingError) {
    toast.error("Gagal memuat data booking. Silakan coba lagi.");
    return <div>Error loading booking data.</div>;
  }

  if (!bookingData?.data) return <div>Data booking tidak ditemukan.</div>;

  return (
    <>
      <MidtransScriptLoader clientKey={clientKey} />
      <BookingDetailPage
        booking={bookingData.data}
        onBack={handleBack}
        onPayment={handlePayment}
      />
    </>
  );
}
