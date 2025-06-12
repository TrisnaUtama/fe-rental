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
} from "lucide-react";
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

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800 text-right">{value}</span>
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
    <div className="absolute -left-1 top-1 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border-2 border-white">
      {day}
    </div>
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          <img
            src={item.destination?.image_urls?.[0] || "/placeholder.svg"}
            alt={item.destination?.name}
            className="w-24 h-24 object-cover rounded-lg bg-gray-100"
          />
          <div>
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
  const navigate = useNavigate();

  
  const {
    travelPack,
    selectedPax,
    departureDate,
    notes,
    card_id,
    licences_id,
  } = bookingState;

  if (!travelPack || !selectedPax || !departureDate) {
    return (
      <div className="text-center py-10">
        <p>Loading booking details...</p>
        <Button variant="link" onClick={() => setCurrentStep(0)}>
          Go Back
        </Button>
      </div>
    );
  }

  const { form, setFieldErrors, resetForm } = useZodForm(
    {
      card_id: "",
      licences_id: "",
      start_date: new Date(departureDate).toLocaleDateString(),
      end_date: "",
      pick_up_at_airport: false,
      vehicle_ids: [],
      notes: notes || "",
      promo_id: "",
      pax_option_id: selectedPax.id,
      travel_package_id: travelPack.id,
    },
    bookingSchema
  );

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
      };
      const data = await createBookingTravel(submision_payload);
      if (data.success) {
        toast.success("Booking Submitted!", {
          description:
            "Your travel package booking is being processed. We will contact you shortly.",
        });
        resetForm();
        navigate("/success-submit-booking",  { state: { bookingType: 'travel' } });
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

  const totalPrice = parseFloat(selectedPax.price.toString());
  const pricePerPerson = totalPrice / selectedPax.pax;
  const endDate = addDays(departureDate, travelPack.duration);

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

  console.log();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Review & Submit Your Trip
        </h2>
        <p className="text-gray-600 mt-2">
          This is the final step. Please confirm all details are correct.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-500" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 p-4 border rounded-lg bg-gray-50">
                <img
                  src={travelPack.image}
                  alt={travelPack.name}
                  className="w-full sm:w-48 h-32 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-600">
                    TRAVEL PACKAGE
                  </p>
                  <h3 className="text-xl font-bold">{travelPack.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {travelPack.description}
                  </p>
                </div>
              </div>

              {/* --- PARTICIPANT DETAILS SECTION (ADDED) --- */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Participant Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Departure Date</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {format(departureDate, "eeee, dd MMM yy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {format(endDate, "eeee, dd MMM yy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Group Size</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    {selectedPax.pax} People
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Accommodation</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-blue-500" />
                    {travelPack.accommodation_id ? "Included" : "Not Included"}
                  </p>
                </div>
              </div>

              <div className="space-y-8 pt-4 border-t">
                <h4 className="font-semibold text-gray-700">Daily Plan</h4>
                <div className="relative pl-4 space-y-10 border-l-2 border-dashed border-gray-200">
                  {Object.keys(groupedItinerary).map((day) => (
                    <ItineraryDay
                      key={day}
                      day={day}
                      items={groupedItinerary[parseInt(day)]}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <FileText className="w-5 h-5 text-blue-500" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Have special requests? Let us know here..."
                value={notes}
                onChange={(e) =>
                  setBookingState((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="h-28"
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-blue-500" />
                Final Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <SummaryRow
                  label={`Price / person`}
                  value={currencyFormatter.format(pricePerPerson)}
                />
                <SummaryRow
                  label={`Group Size`}
                  value={`${selectedPax.pax} People`}
                />
              </div>

              <div className="border-t-2 border-dashed pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">
                    Total Price
                  </span>
                  <span className="text-2xl font-extrabold text-blue-600">
                    {currencyFormatter.format(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button
                  onClick={handleSubmitBooking}
                  size="lg"
                  disabled={isUploading || isCreating}
                  className="w-full h-12 text-base font-bold gap-2"
                >
                  {isCreating || isUploading ? (
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
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Edit Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
