import { useBooking } from "../../../context/BookingStepperContext";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { Calendar, Tag, FileText, CheckCircle, Plane, User, ArrowRight, Wallet } from "lucide-react";
import { useUploadImage } from "@/shared/hooks/useStorage";
import { useAuthContext } from "@/shared/context/authContex";
import { bookingSchema } from "../../../utils/zod.schema";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { useCreateBooking } from "../../../hooks/useBooking";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useCart } from "@/shared/context/cartContext";
import LoadingSpinner from "@/features/redirect/pages/Loading";

const promoOptions = [
  { code: "", label: "No Promo" },
  { code: "SUMMER2025", label: "SUMMER2025 - 10% off" },
  { code: "WEEKEND", label: "WEEKEND - 15% off" },
];

const formatDate = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const SummaryRow = ({ label, value, isDiscount = false }: { label: string; value: string; isDiscount?: boolean; }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={`font-semibold ${isDiscount ? 'text-green-600' : 'text-gray-800'}`}>{value}</span>
  </div>
);

export default function Step2RentalInfo() {
  const { clearCart } = useCart();
  const { accessToken, user } = useAuthContext();
  const { bookingState, setCurrentStep } = useBooking();
  const { mutateAsync: uploadImageAsync, isPending: isUploading } = useUploadImage(accessToken || "");
  const { mutateAsync: createBookingVehicle, isPending: isCreating } = useCreateBooking(accessToken || "");
  const navigate = useNavigate();

  const { form, setForm, setFieldErrors, resetForm } = useZodForm(
    {
      card_id: "",
      licences_id: "",
      start_date: bookingState.bookingDetails[0]?.dateRange.from,
      end_date: bookingState.bookingDetails[0]?.dateRange.to,
      pick_up_at_airport: bookingState.pick_up_at_airport,
      vehicle_ids: bookingState.bookingDetails.map((v) => v.vehicle.id),
      notes: "",
      promo_id: "",
      pax_option_id: "",
      travel_package_id: "",
    },
    bookingSchema
  );

  const handlePromoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      promoCode: e.target.value,
    }));
  };

  const toggleAirportPickup = () => {
    setForm((prev) => ({
      ...prev,
      pick_up_at_airport: !prev.pick_up_at_airport,
    }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };

  const getDays = () => {
    const from = bookingState.bookingDetails[0]?.dateRange.from;
    const to = bookingState.bookingDetails[0]?.dateRange.to;
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const days = Math.ceil(diff);
    return days > 0 ? days : 1; 
  };

  const getTotal = () => {
    const pricePerDay = bookingState.bookingDetails.reduce(
      (sum, v) => sum + Number(v.vehicle.price_per_day),
      0
    );
    let total = pricePerDay * getDays();

    if (bookingState.promoCode === "SUMMER2025") total *= 0.9;
    if (bookingState.promoCode === "WEEKEND") total *= 0.85;

    return total;
  };
  
  const getDiscountAmount = () => {
    const originalTotal =
      bookingState.bookingDetails.reduce(
        (sum, v) => sum + Number(v.vehicle.price_per_day),
        0
      ) * getDays();
    return originalTotal - getTotal();
  };

  const handleSubmit = async () => {
    try {
      const uploadedImageCardId = await uploadImageAsync(bookingState.card_id! as File);
      const uploadedImageLicenseId = await uploadImageAsync(bookingState.licences_id! as File);
      const submision_payload = {
        ...form,
        card_id: uploadedImageCardId.data.url,
        licences_id: uploadedImageLicenseId.data.url,
      };

      const data = await createBookingVehicle(submision_payload);
      if (data.success) {
        toast.success("Success", { description: `Successfully created Vehicles Booking` });
        clearCart();
        resetForm();
        navigate("/success-submit-booking",  { state: { bookingType: 'vehicle' } });
        navigate(0);
      } else {
        toast.error("Failed", { description: `Failed created new booking` });
      }
    } catch (err: any) {
      if (err?.errors && typeof err.errors === 'object') {
        setFieldErrors((prev: any) => ({ ...prev, ...err.errors }));
      } else {
        setFieldErrors((prev) => ({ ...prev, general: err.message || 'Unknown error occurred' }));
        toast.error("Failed to create booking.");
      }
    }
  };

  const subtotal = bookingState.bookingDetails.reduce((sum, v) => sum + Number(v.vehicle.price_per_day), 0) * getDays();
  const finalTotal = getTotal() + (form.pick_up_at_airport ? 50000 : 0);


console.log(bookingState);
  if(!bookingState){
    return <LoadingSpinner/>
  }

  // --- NEW UI STRUCTURE WITH YOUR UNCHANGED LOGIC ---
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Review & Confirm</h2>
        <p className="text-gray-600 mt-2">Just one last look before you confirm your Bali adventure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- Main Content (Left Column) --- */}
        <div className="lg:col-span-2 space-y-8">

          {/* --- CARD DETAIL PEMESANAN (GABUNGAN) --- */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-500" />
              Your Booking Details
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 rounded-full"><User className="w-4 h-4 text-gray-600" /></div><div><p className="text-xs text-gray-500">Booking for</p><p className="font-semibold text-sm">{user?.name}</p></div></div>
              <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 rounded-full"><Calendar className="w-4 h-4 text-gray-600" /></div><div><p className="text-xs text-gray-500">Rental Period ({getDays()} days)</p><p className="font-semibold text-sm flex items-center gap-2">{formatDate(bookingState.bookingDetails[0]?.dateRange.from)}<ArrowRight className="w-3 h-3 text-gray-400" />{formatDate(bookingState.bookingDetails[0]?.dateRange.to)}</p></div></div>
            </div>
            
            <h4 className="text-base font-semibold text-gray-700 mb-4">Selected Vehicle(s)</h4>
            <div className="space-y-4">
              {bookingState.bookingDetails.length ? bookingState.bookingDetails.map(({ vehicle }) => (
                <div key={vehicle.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  <img src={vehicle.image_url[0]} alt={vehicle.name} className="w-24 h-16 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1"><p className="font-semibold text-gray-800">{vehicle.name}</p><p className="text-xs text-gray-500 capitalize">{vehicle.type.replace("_", " ").toLowerCase()}</p></div>
                  <div className="text-right"><p className="font-bold text-gray-800">Rp {Number(vehicle.price_per_day).toLocaleString("id-ID")}</p><p className="text-xs text-gray-500">/ day</p></div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-500">No vehicles selected.</div>
              )}
            </div>
          </div>

          {/* --- KARTU OPSI TAMBAHAN (DESAIN ULANG) --- */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <Tag className="w-6 h-6 text-blue-500" />
              Add-ons & Preferences
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4"><Plane className="w-5 h-5 text-gray-500 flex-shrink-0" /><div><Label htmlFor="pickup-airport" className="font-semibold text-gray-800 cursor-pointer">Airport Pickup Service</Label><p className="text-xs text-gray-500">We'll meet you at the arrival terminal.</p></div></div>
                <div className="flex items-center gap-4"><span className="text-sm font-semibold">+Rp 50,000</span><Checkbox id="pickup-airport" checked={form.pick_up_at_airport} onCheckedChange={toggleAirportPickup} /></div>
              </div>

              <div className="space-y-2 pt-6 border-t">
                <Label htmlFor="promoCode" className="font-medium text-gray-800">Promo Code</Label>
                <div className="flex gap-2">
                  <select id="promoCode" name="promoCode" value={bookingState.promoCode || ""} onChange={handlePromoChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    {promoOptions.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
                  </select>
                  <Button variant="outline">Apply</Button>
                </div>
                {getDiscountAmount() > 0 && (<p className="text-xs text-green-600 flex items-center gap-1 mt-2"><CheckCircle className="w-4 h-4" />You're saving Rp {getDiscountAmount().toLocaleString("id-ID")}!</p>)}
              </div>

              <div className="space-y-2 pt-6 border-t">
                <Label htmlFor="notes" className="font-medium text-gray-800">Additional Notes</Label>
                <Textarea id="notes" placeholder="e.g. Flight number, special arrival time, or other requests..." value={form.notes || ""} onChange={handleNoteChange} />
              </div>
            </div>
          </div>
        </div>

        {/* --- Sidebar (Right) - KARTU RINGKASAN HARGA (DESAIN ULANG) --- */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl border p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3"><Wallet className="w-6 h-6 text-blue-500" />Price Summary</h3>
              <div className="space-y-3 pb-6 border-b">
                <SummaryRow label={`Subtotal (${getDays()} days)`} value={`Rp ${subtotal.toLocaleString("id-ID")}`} />
                {getDiscountAmount() > 0 && <SummaryRow label="Promo Discount" value={`-Rp ${getDiscountAmount().toLocaleString("id-ID")}`} isDiscount />}
                {form.pick_up_at_airport && <SummaryRow label="Airport Pickup" value={`+Rp 50,000`} />}
              </div>
              <div className="flex justify-between items-center pt-6">
                <span className="text-lg font-bold text-gray-900">Total Price</span>
                <span className="text-2xl font-extrabold text-blue-600">Rp {finalTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="space-y-3">
              <Button onClick={handleSubmit} disabled={isUploading || isCreating} size="lg" className="w-full h-12 text-base">
                {isCreating || isUploading ? "Submitting..." : "Confirm & Submit Booking"}
              </Button>
              <Button onClick={() => setCurrentStep(0)} variant="outline" size="lg" className="w-full h-12 text-base">
                Back to Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}