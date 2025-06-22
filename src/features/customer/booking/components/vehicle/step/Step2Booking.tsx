import { useBooking } from "../../../context/BookingStepperContext";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Calendar,
  Tag,
  FileText,
  CheckCircle,
  Plane,
  User,
  ArrowRight,
  Wallet,
  ArrowLeft,
} from "lucide-react";
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
import { useAllPromos } from "@/features/admin/protected/promo/hooks/usePromo";
import type { IPromo } from "@/features/admin/protected/promo/types/promo.type";

// --- HELPER & SUB-COMPONENTS (No logic changes) ---

const formatDate = (isoString: string) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const currencyFormatter = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const SummaryRow = ({
  label,
  value,
  isDiscount = false,
}: {
  label: string;
  value: string;
  isDiscount?: boolean;
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span
      className={`font-semibold ${
        isDiscount ? "text-green-600" : "text-gray-800"
      }`}
    >
      {value}
    </span>
  </div>
);


// --- MAIN COMPONENT (Refactored for UI/UX) ---

export default function Step2RentalInfo() {
  const { clearCart } = useCart();
  const { accessToken, user } = useAuthContext();
  const { bookingState, setCurrentStep } = useBooking();
  const { mutateAsync: uploadImageAsync, isPending: isUploading } =
    useUploadImage(accessToken || "");
  const { mutateAsync: createBookingVehicle, isPending: isCreating } =
    useCreateBooking(accessToken || "");
  const { data: promoOptions } = useAllPromos(accessToken || "");
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

  const handlePromoSelect = (promoId: string) => {
    setForm((prev) => ({ ...prev, promo_id: promoId }));
  };

  const toggleAirportPickup = () => {
    setForm((prev) => ({ ...prev, pick_up_at_airport: !prev.pick_up_at_airport }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, notes: e.target.value }));
  };

  const getDays = () => {
    const from = bookingState.bookingDetails[0]?.dateRange.from;
    const to = bookingState.bookingDetails[0]?.dateRange.to;
    if (!from || !to) return 0;
    const diff = (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24);
    const days = Math.ceil(diff);
    return days > 0 ? days : 1;
  };

  const subtotal = bookingState.bookingDetails.reduce((sum, v) => sum + Number(v.vehicle.price_per_day), 0) * getDays();
  const selectedPromo = promoOptions?.data.find((p) => p.id === form.promo_id);
  const isPromoApplicable = selectedPromo && subtotal >= Number(selectedPromo.min_booking_amount);

  const getDiscountAmount = () => {
    if (isPromoApplicable) {
      return subtotal * (selectedPromo.discount_value / 100);
    }
    return 0;
  };

  const finalTotal = subtotal - getDiscountAmount();

  const handleSubmit = async () => {
    try {
      const uploadedImageCardId = await uploadImageAsync(bookingState.card_id! as File);
      const uploadedImageLicenseId = await uploadImageAsync(bookingState.licences_id! as File);
      const submision_payload = {
        ...form,
        card_id: uploadedImageCardId.data.url,
        licences_id: uploadedImageLicenseId.data.url,
        promo_id: isPromoApplicable ? form.promo_id : "",
      };

      const data = await createBookingVehicle(submision_payload);
      if (data.success) {
        toast.success("Success", { description: `Successfully created Vehicles Booking` });
        clearCart();
        resetForm();
        navigate("/success-submit-booking", { state: { bookingType: "vehicle" } });
        navigate(0);
      } else {
        toast.error("Failed", { description: `Failed created new booking` });
      }
    } catch (err: any) {
      if (err?.errors && typeof err.errors === "object") {
        setFieldErrors((prev: any) => ({ ...prev, ...err.errors }));
      } else {
        setFieldErrors((prev) => ({ ...prev, general: err.message || "Unknown error occurred" }));
        toast.error("Failed to create booking.");
      }
    }
  };

  if (!bookingState) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Review & Confirm Your Rental</h1>
          <p className="mt-2 text-lg text-gray-600">
            One final look before you confirm your vehicle booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-xl shadow-md">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Your Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid sm:grid-cols-2 gap-6 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-4">
                     <User className="w-8 h-8 text-gray-400 flex-shrink-0" />
                     <div>
                       <p className="text-sm text-gray-500">Booking for</p>
                       <p className="font-semibold text-gray-800">{user?.name}</p>
                     </div>
                  </div>
                   <div className="flex items-center gap-4">
                     <Calendar className="w-8 h-8 text-gray-400 flex-shrink-0" />
                     <div>
                       <p className="text-sm text-gray-500">Rental Period ({getDays()} days)</p>
                       <p className="font-semibold text-gray-800 flex items-center gap-2">
                         {formatDate(bookingState.bookingDetails[0]?.dateRange.from)}
                         <ArrowRight className="w-4 h-4 text-gray-400" />
                         {formatDate(bookingState.bookingDetails[0]?.dateRange.to)}
                       </p>
                     </div>
                  </div>
                </div>

                <h4 className="text-base font-semibold text-gray-700 mb-4">Selected Vehicle(s)</h4>
                {/* Scrollable Vehicle List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3">
                  {bookingState.bookingDetails.length ? (
                    bookingState.bookingDetails.map(({ vehicle }) => (
                      <div key={vehicle.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50/80">
                        <img src={vehicle.image_url[0]} alt={vehicle.name} className="w-28 h-20 object-cover rounded-md flex-shrink-0"/>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{vehicle.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{vehicle.type.replace("_", " ").toLowerCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{currencyFormatter(Number(vehicle.price_per_day))}</p>
                          <p className="text-xs text-gray-500">/ day</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">No vehicles selected.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-3">
                        <Tag className="w-6 h-6 text-blue-600" />
                        Preferences & Promotions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Airport Pickup */}
                    <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50/80 transition-colors">
                        <div className="flex items-center gap-4">
                            <Plane className="w-6 h-6 text-gray-500 flex-shrink-0" />
                            <div>
                                <Label htmlFor="pickup-airport" className="font-semibold text-gray-800 cursor-pointer">
                                    Airport Pickup Service
                                </Label>
                                <p className="text-sm text-gray-500">We'll meet you at the arrival terminal.</p>
                            </div>
                        </div>
                        <Checkbox id="pickup-airport" checked={form.pick_up_at_airport} onCheckedChange={toggleAirportPickup} className="w-5 h-5"/>
                    </div>
                    
                    {/* Promos */}
                    <div className="space-y-3 pt-6 border-t">
                        <Label className="font-semibold text-gray-700">Available Promos</Label>
                        {/* Scrollable Promo List */}
                        <RadioGroup value={form.promo_id} onValueChange={handlePromoSelect} className="space-y-3 max-h-[300px] overflow-y-auto pr-3">
                            <div className="flex items-start space-x-4 p-3 border rounded-lg transition-all cursor-pointer hover:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600">
                                <RadioGroupItem value="" id="no-promo" />
                                <Label htmlFor="no-promo" className="w-full cursor-pointer font-medium text-gray-700">
                                    Continue without a promotion
                                </Label>
                            </div>
                            {promoOptions?.data.map((promo: IPromo) => {
                                const isPromoDisabled = subtotal < Number(promo.min_booking_amount);
                                return (
                                <div key={promo.id} className={`flex items-start space-x-4 p-3 border rounded-lg transition-all ${isPromoDisabled ? "opacity-60 bg-gray-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600"}`}>
                                    <RadioGroupItem value={promo.id} id={promo.id} disabled={isPromoDisabled} />
                                    <Label htmlFor={promo.id} className={`grid gap-1.5 w-full ${isPromoDisabled ? "" : "cursor-pointer"}`}>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">{promo.code}</span>
                                        <span className="font-bold text-base text-emerald-600">{promo.discount_value}% OFF</span>
                                    </div>
                                    {promo.min_booking_amount && Number(promo.min_booking_amount) > 0 && (
                                        <p className={`text-xs ${subtotal >= Number(promo.min_booking_amount) ? "text-gray-500" : "text-red-500 font-medium"}`}>
                                            Min. purchase of {currencyFormatter(Number(promo.min_booking_amount))}
                                        </p>
                                    )}
                                    </Label>
                                </div>
                                );
                            })}
                        </RadioGroup>
                        {isPromoApplicable && (
                            <div className="!mt-4 text-sm font-semibold text-emerald-700 flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <CheckCircle className="w-5 h-5" />
                                Promo "{selectedPromo?.code}" applied!
                            </div>
                        )}
                    </div>
                    
                    {/* Notes */}
                    <div className="space-y-3 pt-6 border-t">
                        <Label htmlFor="notes" className="font-semibold text-gray-700">Additional Notes</Label>
                        <Textarea id="notes" placeholder="e.g. Flight number, special arrival time, or other requests..." value={form.notes || ""} onChange={handleNoteChange} className="h-24"/>
                    </div>
                </CardContent>
            </Card>
          </div>

          {/* Right Column (Sticky) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="space-y-6">
                <Card className="rounded-xl shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <Wallet className="w-6 h-6 text-blue-600" />
                            Price Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 pb-4 border-b">
                            <SummaryRow label={`Subtotal (${getDays()} days)`} value={currencyFormatter(subtotal)} />
                            {isPromoApplicable && (
                                <SummaryRow label={`Promo (${selectedPromo.code})`} value={`-${currencyFormatter(getDiscountAmount())}`} isDiscount />
                            )}
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-base font-bold text-gray-900">Total Price</span>
                            <span className="text-2xl font-extrabold text-blue-600">{currencyFormatter(finalTotal)}</span>
                        </div>
                    </CardContent>
                </Card>
                <div className="space-y-3">
                    <Button onClick={handleSubmit} disabled={isUploading || isCreating} size="lg" className="w-full h-12 text-base font-bold gap-2 bg-blue-600 hover:bg-blue-700">
                        {isUploading || isCreating ? "Submitting..." : "Confirm & Submit Booking"}
                    </Button>
                    <Button onClick={() => setCurrentStep(0)} variant="outline" size="lg" className="w-full h-12 text-base">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Edit
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}