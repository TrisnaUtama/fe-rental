import { useMemo } from "react";
import { useTravelPackBooking } from "../../../context/TravelPackBookingContext";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  Users,
  Wallet,
  FileText,
  CheckCircle,
  Hotel,
  User,
  Mail,
  Tag,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { ITravel_Itineraries } from "@/features/admin/protected/travel-pack/types/travel-pack";
import { useCreateBooking } from "../../../hooks/useBooking";
import { useUploadImage } from "@/shared/hooks/useStorage";
import { useAuthContext } from "@/shared/context/authContex";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { bookingSchema } from "../../../utils/zod.schema";
import { formatDate } from "@/shared/utils/format-date";
import { useAllPromos } from "@/features/admin/protected/promo/hooks/usePromo";
import type { IPromo } from "@/features/admin/protected/promo/types/promo.type";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const SummaryRow = ({
  label,
  value,
  isDiscount = false,
}: {
  label: string;
  value: React.ReactNode;
  isDiscount?: boolean;
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span
      className={`font-semibold ${
        isDiscount ? "text-green-600" : "text-gray-800"
      } text-right`}
    >
      {value}
    </span>
  </div>
);

const ItineraryDay = ({
  day,
  items,
}: {
  day: string;
  items: ITravel_Itineraries[];
}) => (
  <div className="relative pl-8">
    <div className="absolute -left-1.5 top-1 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border-4 border-white">
      {day}
    </div>
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 items-start">
          <img
            src={item.destination?.image_urls?.[0] || "/placeholder.svg"}
            alt={item.destination?.name || "Activity Image"}
            className="w-28 h-28 object-cover rounded-lg bg-gray-100"
          />
          <div className="pt-1">
            <h4 className="font-semibold text-gray-800">
              {item.destination?.name || "Aktivitas"}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);


export function Step2_TravelPackReview() {
  const { accessToken, user } = useAuthContext();
  const { bookingState, setBookingState, setCurrentStep } =
    useTravelPackBooking();
  const { mutateAsync: createBookingTravel, isPending: isCreating } =
    useCreateBooking(accessToken || "");
  const { mutateAsync: uploadImageAsync, isPending: isUploading } =
    useUploadImage(accessToken || "");
  const { data: promoOptions } = useAllPromos(accessToken || "");
  const navigate = useNavigate();

  const {
    travelPack,
    selectedPax,
    departureDate,
    notes,
    card_id,
    licences_id,
  } = bookingState;

  const { form, setForm, setFieldErrors, resetForm } = useZodForm(
    {
      card_id: "",
      licences_id: "",
      start_date: new Date(departureDate!).toLocaleDateString(),
      end_date: "",
      pick_up_at_airport: false,
      vehicle_ids: [],
      notes: notes || "",
      promo_id: "",
      pax_option_id: selectedPax?.id || "",
      travel_package_id: travelPack?.id || "",
    },
    bookingSchema
  );

  const handlePromoSelect = (promoId: string) => {
    setForm((prev) => ({
      ...prev,
      promo_id: promoId,
    }));
  };

  if (!travelPack || !selectedPax || !departureDate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-500 mb-4">
          Loading booking details...
        </p>
        <Button variant="outline" onClick={() => setCurrentStep(0)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const subtotal = parseFloat(selectedPax.price.toString());
  const selectedPromo = promoOptions?.data.find(
    (p: IPromo) => p.id === form.promo_id
  );
  const isPromoApplicable =
    selectedPromo && subtotal >= Number(selectedPromo.min_booking_amount);

  const getDiscountAmount = () => {
    if (isPromoApplicable) {
      return subtotal * (selectedPromo.discount_value / 100);
    }
    return 0;
  };

  const finalTotal = subtotal - getDiscountAmount();

  const handleSubmitBooking = async () => {
    if (!card_id || !licences_id) {
      toast.error("Documents are missing. Please go back and upload them.");
      setCurrentStep(0);
      return;
    }
    try {
      const [cardIdResult, licenseIdResult] = await Promise.all([
        uploadImageAsync(card_id),
        uploadImageAsync(licences_id),
      ]);
      const submision_payload = {
        travel_package_id: form.travel_package_id,
        pax_option_id: form.pax_option_id,
        start_date: formatDate(new Date(form.start_date)),
        notes: notes || "",
        card_id: cardIdResult.data.url,
        licences_id: licenseIdResult.data.url,
        pick_up_at_airport: form.pick_up_at_airport || false,
        promo_id: isPromoApplicable ? form.promo_id : "",
      };
      const data = await createBookingTravel(submision_payload);
      if (data.success) {
        toast.success("Booking Submitted!", {
          description:
            "Your travel package booking is being processed. We will contact you shortly.",
        });
        resetForm();
        navigate("/success-submit-booking", {
          state: { bookingType: "travel" },
        });
        navigate(0);
      } else {
        toast.error("Failed", { description: `Failed created new booking` });
      }
    } catch (err: any) {
      if (err?.errors && typeof err.errors === "object") {
        setFieldErrors((prev: any) => ({ ...prev, ...err.errors }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          general: err.message || "Unknown error occurred",
        }));
        toast.error("Failed to create booking.");
      }
    }
  };

  const endDate = addDays(departureDate, travelPack.duration - 1);

  const groupedItinerary = useMemo(() => {
    if (!travelPack?.travel_itineraries) return {};
    return travelPack.travel_itineraries.reduce(
      (acc: any, item: ITravel_Itineraries) => {
        (acc[item.day_number!] = acc[item.day_number!] || []).push(item);
        return acc;
      },
      {} as Record<number, ITravel_Itineraries[]>
    );
  }, [travelPack.travel_itineraries]);

  return (
    <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Review & Submit Your Trip
            </h1>
            <p className="mt-2 text-lg text-gray-600">
            One final check. Please confirm all details below are correct.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
            {/* Left Column: All Details, Preferences, and Notes */}
            <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-xl shadow-md">
                <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Booking Details
                </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                {/* Package Info */}
                <div className="flex flex-col sm:flex-row gap-6 p-4 border rounded-lg bg-gray-50/80">
                    <img
                    src={travelPack.image}
                    alt={travelPack.name}
                    className="w-full sm:w-52 h-40 object-cover rounded-md"
                    />
                    <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-600">
                        TRAVEL PACKAGE
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">{travelPack.name}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {travelPack.description}
                    </p>
                    </div>
                </div>

                {/* Participant & Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">Participant</h4>
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Name</p>
                                <p className="font-medium text-gray-800">{user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium text-gray-800">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700">Trip Info</h4>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Dates</p>
                                <p className="font-medium text-gray-800">{format(departureDate, "dd MMM")} - {format(endDate, "dd MMM yy")}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Group Size</p>
                                <p className="font-medium text-gray-800">{selectedPax.pax} People</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Hotel className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Accommodation</p>
                                <p className="font-medium text-gray-800">{travelPack.accommodation_id ? "Included" : "Not Included"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        Daily Plan ({travelPack.duration} Days)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="relative max-h-[600px] overflow-y-auto pr-4 space-y-10 border-l-2 border-dashed border-gray-200">
                    {Object.keys(groupedItinerary).map((day) => (
                        <ItineraryDay
                        key={day}
                        day={day}
                        items={groupedItinerary[parseInt(day)]}
                        />
                    ))}
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
                    <div className="space-y-3">
                        <Label className="font-semibold text-gray-700">Available Promos</Label>
                        <RadioGroup
                            value={form.promo_id}
                            onValueChange={handlePromoSelect}
                            className="space-y-3 max-h-[250px] overflow-y-auto pr-2"
                        >
                            <div className="flex items-start space-x-4 p-3 border rounded-lg transition-all cursor-pointer hover:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600">
                                <RadioGroupItem value="" id="no-promo" />
                                <Label htmlFor="no-promo" className="w-full cursor-pointer font-medium text-gray-700">
                                    Continue without a promo
                                </Label>
                            </div>
                            {promoOptions?.data.map((promo: IPromo) => {
                            const isPromoDisabled = subtotal < Number(promo.min_booking_amount);
                            return (
                                <div key={promo.id} className={`flex items-start space-x-4 p-3 border rounded-lg transition-all ${ isPromoDisabled ? "opacity-60 bg-gray-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-600"}`}>
                                <RadioGroupItem value={promo.id} id={promo.id} disabled={isPromoDisabled}/>
                                <Label htmlFor={promo.id} className={`grid gap-1.5 w-full ${isPromoDisabled ? "" : "cursor-pointer"}`}>
                                    <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">{promo.code}</span>
                                    <span className="font-bold text-base text-emerald-600">{promo.discount_value}% OFF</span>
                                    </div>
                                    {promo.min_booking_amount && Number(promo.min_booking_amount) > 0 && (
                                    <p className={`text-xs ${ subtotal >= Number(promo.min_booking_amount) ? "text-gray-500" : "text-red-500 font-medium" }`}>
                                        Min. purchase of{" "} {currencyFormatter.format(Number(promo.min_booking_amount))}
                                    </p>
                                    )}
                                </Label>
                                </div>
                            );
                            })}
                        </RadioGroup>
                        {isPromoApplicable && (
                            <div className="!mt-4 text-sm font-semibold text-emerald-700 flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                <CheckCircle className="w-5 h-5" /> Promo "{selectedPromo?.code}" applied!
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-3 pt-6 border-t">
                        <Label htmlFor="notes" className="font-semibold text-gray-700">Additional Notes</Label>
                        <Textarea id="notes" placeholder="Have special requests, allergies, or other needs? Let us know..." value={notes}
                            onChange={(e) =>
                                setBookingState((prev) => ({
                                ...prev,
                                notes: e.target.value,
                                }))
                            }
                            className="h-24"
                        />
                    </div>
                </CardContent>
            </Card>
            </div>

            {/* Right Column: Sticky Sidebar with ONLY Final Payment */}
            <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-8">
                <Card className="rounded-xl shadow-lg bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <Wallet className="w-6 h-6 text-blue-600" />
                            Final Payment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <SummaryRow
                            label={`Subtotal`}
                            value={currencyFormatter.format(subtotal)}
                            />
                            {isPromoApplicable && (
                            <SummaryRow
                                label={`Promo (${selectedPromo.code})`}
                                value={`-${currencyFormatter.format(getDiscountAmount())}`}
                                isDiscount
                            />
                            )}
                        </div>

                        <div className="border-t-2 border-dashed pt-4 mt-4">
                            <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">
                                Total Price
                            </span>
                            <span className="text-2xl font-extrabold text-blue-600">
                                {currencyFormatter.format(finalTotal)}
                            </span>
                            </div>
                        </div>

                        <div className="pt-6 border-t space-y-3">
                            <Button
                            onClick={handleSubmitBooking}
                            size="lg"
                            disabled={isUploading || isCreating}
                            className="w-full h-12 text-base font-bold gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                            {isUploading || isCreating ? (
                                "Submitting..."
                            ) : (
                                <>
                                <CheckCircle className="w-5 h-5" /> Confirm & Book Now
                                </>
                            )}
                            </Button>
                            <Button
                            onClick={() => setCurrentStep(0)}
                            variant="outline"
                            size="lg"
                            className="w-full"
                            >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Edit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </aside>
        </div>
        </div>
    </div>
  );
}