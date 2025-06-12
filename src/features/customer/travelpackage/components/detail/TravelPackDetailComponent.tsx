import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { TravelPax, ITravel_Itineraries } from "@/features/admin/protected/travel-pack/types/travel-pack";
import { useTravelPackById } from "@/features/admin/protected/travel-pack/hooks/useTravelPack";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { Button } from "@/shared/components/ui/button";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { ArrowLeft, Calendar, MapPin, Users, CheckCircle, Hotel, XCircle, Loader2 } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { startOfDay } from "date-fns"; 

import { useGetUnavailableDatesForVehicles } from "@/features/customer/booking/hooks/useBooking";
import { useAllVehicle } from "@/features/admin/protected/vehicle/hooks/useVehicle";


const currencyFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

const HighlightItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
  <div className="flex flex-col items-center text-center bg-gray-100/60 p-4 rounded-xl border border-gray-200/80">
    <Icon className="w-8 h-8 text-blue-500 mb-2" />
    <span className="text-sm text-gray-500">{label}</span>
    <span className="font-bold text-gray-800 mt-1">{value}</span>
  </div>
);

const ItineraryItemCard = ({ item }: { item: ITravel_Itineraries }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <img
      src={item.destination?.image_urls?.[0] || '/placeholder.svg'}
      alt={item.destination?.name || 'Destination'}
      className="w-full sm:w-40 h-32 object-cover rounded-lg bg-gray-100 flex-shrink-0"
    />
    <div>
      <h4 className="font-bold text-gray-800">{item.destination?.name || 'Activity'}</h4>
      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
    </div>
  </div>
);

export default function TravelPackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: travelPack, isLoading } = useTravelPackById(id!);
  const { data: dataVehicle, isLoading: isLoadingAllVehicles } = useAllVehicle();

  const [selectedPaxOption, setSelectedPaxOption] = useState<TravelPax | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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
    return travelPack.data.travel_itineraries.reduce((acc: any, item: ITravel_Itineraries) => {
      (acc[item.day_number!] = acc[item.day_number!] || []).push(item);
      return acc;
    }, {} as Record<number, ITravel_Itineraries[]>);
  }, [travelPack]);

  const galleryImages = useMemo(() => {
    if (!travelPack?.data) return [];

    const destinationImages = travelPack.data.travel_itineraries
      ?.map((it: ITravel_Itineraries) => it.destination?.image_urls?.[0])
      .filter(Boolean) as string[];

    const uniqueImages = [...new Set(destinationImages)];

    return [travelPack.data.image, ...uniqueImages.slice(0, 4)];
  }, [travelPack]);

  const vehicleIdsForThisTravelPack = useMemo(() => {
    if (dataVehicle?.data && Array.isArray(dataVehicle.data)) {
      const ids = dataVehicle.data.map(vehicle => vehicle.id);
      return ids;
    }
    return [];
  }, [dataVehicle]);

  const {
    data: unavailableDatesData,
    isLoading: isLoadingUnavailableDates,
    isError: isErrorUnavailableDates,
    error: unavailableDatesError,
  } = useGetUnavailableDatesForVehicles(
    vehicleIdsForThisTravelPack,
  );

  useEffect(() => {
    if (unavailableDatesData) {
    } else {
    }
  }, [unavailableDatesData]);

  const disabledDates = useMemo(() => {
    if (unavailableDatesData) {
      const allUnavailableDatesStrings: string[] = [];
      Object.values(unavailableDatesData).forEach(datesArray => {
        allUnavailableDatesStrings.push(...(datesArray as string[]));
      });


      return allUnavailableDatesStrings.map(dateString => {
        const [year, month, day] = dateString.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const normalizedDate = startOfDay(dateObj);
        return normalizedDate;
      });
    }
    return [];
  }, [unavailableDatesData]);
  console.log("vehicleIdsForThisTravelPack (final):", vehicleIdsForThisTravelPack);
  console.log("unavailableDatesData (final):", unavailableDatesData);
  console.log("disabledDates (final):", disabledDates);


  if (isLoading || isLoadingAllVehicles ) {
    return <LoadingSpinner />;
  }

  if (!travelPack?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-xl font-bold">Package Not Found</h2>
        <p className="text-gray-600">The travel package you are looking for does not exist.</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const { data: pack } = travelPack;
  const totalPrice = selectedPaxOption ? parseFloat(selectedPaxOption.price.toString()) : 0;

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
      notes: "" ,
    };

    navigate("/booking-travel-pack", { state: bookingData });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Button
          onClick={() => navigate("/travels")}
          variant="ghost"
          className="group mb-4 -ml-3 text-sm flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Catalog
        </Button>

        <header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[450px]">
            <div className="h-full rounded-l-2xl overflow-hidden bg-gray-100">
              <img src={activeImage || pack.image} alt="Main package view" className="w-full h-full object-cover transition-all duration-300" />
            </div>
            <div className="hidden md:grid grid-cols-2 gap-2 h-full">
              {galleryImages.slice(1, 5).map((img, idx) => (
                <div key={idx} className={`overflow-hidden bg-gray-100 ${idx === 1 && 'rounded-tr-2xl'} ${idx === 3 && 'rounded-br-2xl'}`}>
                  <img src={img} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveImage(img)} />
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-8">{pack.name}</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12 py-10">
          <main className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HighlightItem icon={Calendar} label="Duration" value={`${pack.duration} Days`} />
              <HighlightItem icon={Users} label="Group Size" value={`Up to ${Math.max(...pack.pax_options.map(p => p.pax))} pax`} />
              <HighlightItem icon={MapPin} label="Destinations" value={`${pack.travel_package_destinations.length} places`} />
              <HighlightItem icon={Hotel} label="Accommodation" value={pack.accommodation_id ? "Included" : "Not Included"} />
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Trip</h2>
              <p className="text-gray-600 leading-relaxed">{pack.description}</p>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h2>
              <div className="relative pl-6 space-y-10 border-l-2 border-dashed border-blue-200">
                {Object.keys(groupedItinerary).map(day => (
                  <div key={day} className="relative">
                    <div className="absolute -left-[34px] -top-1 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">{day}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Day {day}</h3>
                      <div className="space-y-6">
                        {groupedItinerary[parseInt(day)].map((item: ITravel_Itineraries) => (
                          <ItineraryItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included / Excluded</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" /> <div><span className="font-semibold">Private Transport</span><p className="text-xs text-gray-500">AC vehicle for your group only.</p></div></div>
                <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" /> <div><span className="font-semibold">Tour Guide</span><p className="text-xs text-gray-500">Professional and friendly local guide.</p></div></div>
                <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" /> <div><span className="font-semibold">Entrance Tickets</span><p className="text-xs text-gray-500">All tickets for destinations in itinerary.</p></div></div>
                <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" /> <div><span className="font-semibold">Parking & Toll Fees</span><p className="text-xs text-gray-500">All fees are covered.</p></div></div>
                <div className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" /> <div><span className="font-semibold text-gray-500">Flight Tickets</span><p className="text-xs text-gray-500">Flights to and from Bali are not included.</p></div></div>
                <div className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" /> <div><span className="font-semibold text-gray-500">Personal Expenses</span><p className="text-xs text-gray-500">Shopping, additional meals, etc.</p></div></div>
              </div>
            </div>
          </main>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-xl border">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Start Your Adventure</h2>
              <p className="text-sm text-gray-500 mb-4">Select your group size and departure date.</p>

              <div className="mb-4">
                <Label className="font-semibold text-sm">Departure Date</Label>
                {isLoadingUnavailableDates || isLoadingAllVehicles ? (
                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading available dates...</span>
                  </div>
                ) : isErrorUnavailableDates ? (
                  <div className="text-red-500 text-sm mt-2">
                    Error loading dates: {unavailableDatesError?.message || 'Unknown error'}
                  </div>
                ) : (
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    disabled={disabledDates}
                  />
                )}
              </div>

              <div className="mb-4">
                <Label className="font-semibold text-sm">Group Size</Label>
                <div className="space-y-2 mt-1">
                  {pack.pax_options.map(option => (
                    <div key={option.id} onClick={() => setSelectedPaxOption(option)} className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex justify-between items-center ${selectedPaxOption?.id === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex items-center gap-3"><Users className={`w-5 h-5 ${selectedPaxOption?.id === option.id ? 'text-blue-600' : 'text-gray-500'}`} /><span className="font-semibold">{option.pax} People</span></div>
                      <p className="font-bold text-base">{currencyFormatter.format(parseFloat(option.price.toString()))}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center"><span className="text-gray-600 font-semibold">Total Price</span><span className="text-2xl font-extrabold text-blue-600">{currencyFormatter.format(totalPrice)}</span></div>
                <Button onClick={handleBooking} size="lg" className="w-full h-12 text-base font-bold">Book This Package</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
