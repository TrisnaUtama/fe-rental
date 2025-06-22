import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type {
  TravelPax,
  ITravel_Itineraries,
} from "@/features/admin/protected/travel-pack/types/travel-pack";
import { useTravelPackById } from "@/features/admin/protected/travel-pack/hooks/useTravelPack";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { Button } from "@/shared/components/ui/button";
import { DatePicker } from "@/shared/components/ui/date-picker";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Hotel,
  XCircle,
  Loader2,
} from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { startOfDay } from "date-fns";

import { useAllVehicle } from "@/features/admin/protected/vehicle/hooks/useVehicle";
import { useGetFullyBookedDates } from "@/features/admin/protected/booking/hooks/useBooking";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const HighlightItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col items-center text-center bg-gray-100/60 p-4 rounded-xl border border-gray-200/80 transition-transform duration-200 hover:scale-[1.02] hover:shadow-md">
    <Icon className="w-8 h-8 text-blue-500 mb-2" />
    <span className="text-sm text-gray-500">{label}</span>
    <span className="font-bold text-gray-800 mt-1">{value}</span>
  </div>
);

const ItineraryItemCard = ({ item }: { item: ITravel_Itineraries }) => (
  <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <img
      src={
        item.destination?.image_urls?.[0] ||
        "https://via.placeholder.com/160x128?text=No+Image"
      }
      alt={item.destination?.name || "Destination"}
      className="w-full sm:w-40 h-32 object-cover rounded-lg bg-gray-100 flex-shrink-0"
    />
    <div>
      <h4 className="font-bold text-gray-800 text-lg">
        {item.destination?.name || "Activity"}
      </h4>
      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
    </div>
  </div>
);

export default function TravelPackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: travelPack, isLoading } = useTravelPackById(id!);
  const { data: dataVehicle, isLoading: isLoadingAllVehicles } =
    useAllVehicle();
  const today = new Date();
  today.setDate(today.getDate() + 1);

  const [selectedPaxOption, setSelectedPaxOption] = useState<TravelPax | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (travelPack?.data) {
      if (travelPack.data.pax_options?.[0]) {
        setSelectedPaxOption(travelPack.data.pax_options[0]);
      }
      if (travelPack.data.image) {
        setActiveImage(travelPack.data.image);
      }
    }
  }, [travelPack]);

  const groupedItinerary = useMemo(() => {
    if (!travelPack?.data?.travel_itineraries) return {};
    return travelPack.data.travel_itineraries.reduce(
      (
        acc: Record<number, ITravel_Itineraries[]>,
        item: ITravel_Itineraries
      ) => {
        (acc[item.day_number!] = acc[item.day_number!] || []).push(item);
        return acc;
      },
      {} as Record<number, ITravel_Itineraries[]>
    );
  }, [travelPack]);

  const galleryImages = useMemo(() => {
    if (!travelPack?.data) return [];

    const destinationImages = travelPack.data.travel_itineraries
      ?.map((it: ITravel_Itineraries) => it.destination?.image_urls?.[0])
      .filter(Boolean) as string[];

    const uniqueImages = [...new Set(destinationImages)];

    return [travelPack.data.image, ...uniqueImages.slice(0, 4)].filter(
      Boolean
    ) as string[];
  }, [travelPack]);

  const vehicleIdsForThisTravelPack = useMemo(() => {
    if (dataVehicle?.data && Array.isArray(dataVehicle.data)) {
      const ids = dataVehicle.data.map((vehicle) => vehicle.id);
      return ids;
    }
    return [];
  }, [dataVehicle]);

  const {
    data: fullyBookedData,
    isLoading: isLoadingFullyBooked,
    isError: isErrorFullyBooked,
  } = useGetFullyBookedDates(vehicleIdsForThisTravelPack);

  const disabledDates = useMemo(() => {
    if (fullyBookedData?.data && Array.isArray(fullyBookedData.data)) {
      return fullyBookedData.data.map((dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return startOfDay(new Date(year, month - 1, day));
      });
    }
    return [];
  }, [fullyBookedData]);

  if (
    isLoading ||
    isLoadingAllVehicles ||
    isLoadingFullyBooked ||
    isErrorFullyBooked
  ) {
    return <LoadingSpinner />;
  }

  if (!travelPack?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Package Not Found</h2>
        <p className="text-gray-600 max-w-md">
          We couldn't find the travel package you're looking for. It might have
          been removed or the link is incorrect.
        </p>
        <Button onClick={() => navigate(-1)} className="mt-4 px-6 py-3 text-lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const { data: pack } = travelPack;
  const totalPrice = selectedPaxOption
    ? parseFloat(selectedPaxOption.price.toString())
    : 0;

  const handleBooking = () => {
    if (!selectedPaxOption) {
      toast.error("Please select a package option.");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a departure date.");
      return;
    }

    const bookingData = {
      travelPack: pack,
      selectedPax: selectedPaxOption,
      departureDate: selectedDate,
      notes: "",
    };

    navigate("/booking-travel-pack", { state: bookingData });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Button
          onClick={() => navigate("/travels")}
          variant="ghost"
          className="group mb-6 -ml-3 text-sm flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Catalog
        </Button>

        <header className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-lg">
            <div className="md:col-span-3 h-full overflow-hidden bg-gray-100 relative group">
              <img
                key={activeImage}
                src={activeImage || pack.image}
                alt="Main package view"
                className="w-full h-full object-cover transition-all duration-500 ease-in-out transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
              {galleryImages.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className={`overflow-hidden bg-gray-100 ${
                    idx === 1 ? "rounded-tr-2xl" : ""
                  } ${idx === 3 ? "rounded-br-2xl" : ""}`}
                >
                  <img
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity duration-300"
                    onClick={() => setActiveImage(img)}
                  />
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-8 leading-tight">
            {pack.name}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-12 py-10">
          <main className="lg:col-span-2 space-y-12">
            <section className="animate-fade-in-up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <HighlightItem
                  icon={Calendar}
                  label="Duration"
                  value={`${pack.duration} Days`}
                />
                <HighlightItem
                  icon={Users}
                  label="Group Size"
                  value={`Up to ${Math.max(
                    ...pack.pax_options.map((p) => p.pax)
                  )} pax`}
                />
                <HighlightItem
                  icon={MapPin}
                  label="Destinations"
                  value={`${pack.travel_package_destinations.length} places`}
                />
                <HighlightItem
                  icon={Hotel}
                  label="Accommodation"
                  value={pack.accommodation_id ? "Included" : "Not Included"}
                />
              </div>
            </section>

            <section className="border-t pt-8 animate-fade-in-up delay-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Trip
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify">
                {pack.description}
              </p>
            </section>

            <section className="border-t pt-8 animate-fade-in-up delay-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Daily Itinerary
              </h2>
              <div className="relative pl-8 md:pl-12 space-y-10 border-l-2 border-dashed border-blue-300">
                {Object.keys(groupedItinerary)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((day) => (
                    <div key={day} className="relative">
                      <div className="absolute -left-[39px] md:-left-[47px] -top-1 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base border-4 border-white shadow-md">
                        {day}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Day {day}
                      </h3>
                      <div className="space-y-6">
                        {groupedItinerary[parseInt(day)].map(
                          (item: ITravel_Itineraries) => (
                            <ItineraryItemCard key={item.id} item={item} />
                          )
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            <section className="border-t pt-8 animate-fade-in-up delay-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What's Included / Excluded
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <div>
                    <span className="font-semibold">Private Transport</span>
                    <p className="text-xs text-gray-500">
                      AC vehicle for your group only.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <div>
                    <span className="font-semibold">Tour Guide</span>
                    <p className="text-xs text-gray-500">
                      Professional and friendly local guide.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <div>
                    <span className="font-semibold">Entrance Tickets</span>
                    <p className="text-xs text-gray-500">
                      All tickets for destinations in itinerary.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />{" "}
                  <div>
                    <span className="font-semibold">Parking & Toll Fees</span>
                    <p className="text-xs text-gray-500">
                      All fees are covered.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />{" "}
                  <div>
                    <span className="font-semibold text-gray-700">
                      Flight Tickets
                    </span>
                    <p className="text-xs text-gray-500">
                      Flights to and from Bali are not included.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />{" "}
                  <div>
                    <span className="font-semibold text-gray-700">
                      Personal Expenses
                    </span>
                    <p className="text-xs text-gray-500">
                      Shopping, additional meals, etc.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <aside className="lg:sticky lg:top-24 h-fit p-4 lg:p-0">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Book Your Adventure
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Select your group size and desired departure date to start.
              </p>

              <div className="mb-5">
                <Label
                  htmlFor="departure-date"
                  className="font-semibold text-sm text-gray-700 mb-2 block"
                >
                  Departure Date
                </Label>

                {isLoadingFullyBooked || isLoadingAllVehicles ? (
                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading available dates...</span>
                  </div>
                ) : isErrorFullyBooked ? (
                  <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    <span>Error loading dates. Please try again.</span>
                  </div>
                ) : (
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    disabled={[
                      ...disabledDates,
                      {
                        before: new Date(
                          new Date().setDate(new Date().getDate() + 1)
                        ),
                      },
                    ]}
                  />
                )}
              </div>

              <div className="mb-6">
                <Label className="font-semibold text-sm text-gray-700 mb-2 block">
                  Group Size
                </Label>
                <div className="space-y-3">
                  {pack.pax_options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setSelectedPaxOption(option)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 flex justify-between items-center
                      ${
                        selectedPaxOption?.id === option.id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users
                          className={`w-5 h-5 ${
                            selectedPaxOption?.id === option.id
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        />
                        <span className="font-semibold text-gray-800">
                          {option.pax} People
                        </span>
                      </div>
                      <p className="font-bold text-lg text-gray-900">
                        {currencyFormatter.format(
                          parseFloat(option.price.toString())
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-5 mt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold text-lg">
                    Total Price
                  </span>
                  <span className="text-3xl font-extrabold text-blue-600">
                    {currencyFormatter.format(totalPrice)}
                  </span>
                </div>
                <Button
                  onClick={handleBooking}
                  size="lg"
                  className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Book This Package
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
