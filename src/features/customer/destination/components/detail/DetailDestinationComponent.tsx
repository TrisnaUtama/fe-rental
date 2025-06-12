import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDestinationById } from "@/features/admin/protected/destinations/hooks/useDestinations";
import { useAllTravelPack } from "@/features/admin/protected/travel-pack/hooks/useTravelPack"; 
import type { ITravelPack } from "@/features/admin/protected/travel-pack/types/travel-pack";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { Button } from "@/shared/components/ui/button";
import { TravelPackCard } from "../../../travelpackage/components/catalog/TravelPackCard";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Ticket,
  Building,
  ExternalLink,
} from "lucide-react";


const InfoPill = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700 font-medium">
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </div>
);

const FacilityItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 border">
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
      <Building className="w-4 h-4 text-green-600" />
    </div>
    <span className="font-medium text-gray-700">{text}</span>
  </div>
);


export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: destinationData, isLoading: isLoadingDestination } = useDestinationById(id!);
  const { data: allTravelPacksData, isLoading: isLoadingPacks } = useAllTravelPack();

  const [activeImage, setActiveImage] = useState("");
  const [relatedPackages, setRelatedPackages] = useState<ITravelPack[]>([]);

  useEffect(() => {
    if (destinationData?.data && allTravelPacksData?.data) {
      if (destinationData.data.image_urls?.[0]) {
        setActiveImage(destinationData.data.image_urls[0]);
      }

      const relatedPackageIds = new Set(
        destinationData.data.travel_package_destinations?.map(
          (link) => link.travel_package_id
        ) || []
      );

      const filteredPacks = allTravelPacksData.data.filter((pack) =>
        relatedPackageIds.has(pack.id)
      );
      
      setRelatedPackages(filteredPacks);
    }
  }, [destinationData, allTravelPacksData]);

  const isLoading = isLoadingDestination || isLoadingPacks;
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!destinationData?.data) {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h2 className="text-xl font-bold">Destination Not Found</h2>
            <p className="text-gray-600">The destination you are looking for does not exist.</p>
            <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
            </Button>
        </div>
    );
  }

  const destination = destinationData.data;
  const galleryImages = destination.image_urls || [];
  
  const encodedAddress = encodeURIComponent(destination.address);
  const mapEmbedSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  const mapLinkSrc = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/destinations")}
          className="group mb-4 -ml-3 text-sm flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Destinations
        </Button>

        <header>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[450px]">
            <div className="md:col-span-3 h-full rounded-l-2xl overflow-hidden bg-gray-100">
              <img
                src={activeImage}
                alt="Main view"
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            <div className="hidden md:flex flex-col gap-2 h-full">
              {galleryImages.slice(1, 4).map((img, idx) => (
                <div
                  key={idx}
                  className={`overflow-hidden flex-1 ${
                    idx === 0 && "rounded-tr-2xl"
                  } ${idx === 2 && "rounded-br-2xl"}`}
                >
                  <img
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setActiveImage(img)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm font-bold text-blue-600 uppercase">
              {destination.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-1">
              {destination.name}
            </h1>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-12 mt-10">
            <main className="lg:col-span-2 space-y-12">
                {/* About this destination */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About {destination.name}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                    {destination.description}
                    </p>
                </div>

                {/* Facilities */}
                {destination.facilities && destination.facilities.length > 0 && (
                    <div className="pt-8 border-t">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Facilities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {destination.facilities.map((facility) => (
                            <FacilityItem key={facility} text={facility} />
                        ))}
                        </div>
                    </div>
                )}
            </main>
            {/* Sidebar with Location & Info */}
            <aside className="lg:sticky lg:top-24 h-fit">
                <div className="bg-white p-6 rounded-2xl shadow-xl border">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Location & Info
                    </h3>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <InfoPill icon={Clock} text={`Open: ${destination.open_hour}`} />
                            <InfoPill icon={Ticket} text="Ticket Info Varies"/>
                        </div>
                        <div className="flex items-start gap-3 pt-4 border-t">
                            <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-800">Address</p>
                                <p className="text-sm text-gray-600">
                                    {destination.address}
                                </p>
                            </div>
                        </div>
                        {/* Interactive Google Map Iframe */}
                        <div className="h-48 rounded-lg overflow-hidden border">
                            <iframe
                                title={`Map of ${destination.name}`}
                                src={mapEmbedSrc}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <a href={mapLinkSrc} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Open in Google Maps
                            </Button>
                        </a>
                    </div>
                </div>
            </aside>
        </div>

        {relatedPackages.length > 0 && (
            <div className="pt-12 mt-12 border-t">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Travel Packages Featuring This Destination
                </h2>
                <p className="text-gray-600 mb-6">
                Explore curated journeys that include a visit to {destination.name}.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPackages.map((pack) => (
                    <TravelPackCard key={pack.id} travelPack={pack} />
                ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
