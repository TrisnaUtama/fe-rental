import {
  CarFront,
  Palmtree,
  Map,
  BotMessageSquare,
} from "lucide-react";
import { MenuBar } from "@/shared/components/layout/customer/shared/menubar";
import { DynamicSearchBar } from "@/shared/components/layout/customer/shared/searchBar";
import { WhyChoosee } from "@/shared/components/layout/customer/shared/why-choose-us";
import { Testimonial } from "@/shared/components/layout/customer/shared/testimonials";
import { Cta } from "@/shared/components/layout/customer/shared/cta";
import { FAQ } from "@/shared/components/layout/customer/shared/FAQ";
import { useLocation } from "react-router-dom";
import { DestinationCarousel } from "../destination/carousel";
import { VehiclesCarousel } from "../vehicle/carousel";
import { VehicleHeader } from "../vehicle/header";
import { DestinationHeader } from "../destination/header";
import { useAllVehicle } from "@/features/admin/protected/vehicle/hooks/useVehicle";
import { useAllDestinations } from "@/features/admin/protected/destinations/hooks/useDestinations";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { useAuthContext } from "@/shared/context/authContex";
import type { IDestination } from "@/features/admin/protected/destinations/types/destination.type";
import { useEffect, useState } from "react";
import { useRecomendations } from "@/features/customer/destination/hooks/useRecomendations";
import { useAllTravelPack } from "@/features/admin/protected/travel-pack/hooks/useTravelPack";
import { TravelPackCarousel } from "../travelpack/carousel";
import { TravelPackHeader } from "../travelpack/header";

const menuBar = [
  { label: "Trips", icon: <Map />, path: "/travel" },
  { label: "Car Rental", icon: <CarFront />, path: "/car-rental" },
  { label: "Destinations", icon: <Palmtree />, path: "/destination" },
  { label: "AI", icon: <BotMessageSquare />, path: "/ai" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Australia",
    rating: 5,
    comment:
      "Amazing experience exploring Bali! The car rental was smooth and the recommendations were perfect.",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    name: "David Chen",
    location: "Singapore",
    rating: 5,
    comment:
      "Best way to explore Bali's hidden gems. Professional service and great vehicles!",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    name: "Emma Wilson",
    location: "UK",
    rating: 5,
    comment:
      "The AI recommendations helped us discover places we never would have found. Highly recommended!",
    avatar: "/placeholder.svg?height=50&width=50",
  },
];

export default function LandingPageLayout() {
  const [destination, setDestination] = useState<IDestination[]>([]);
  const { user, accessToken } = useAuthContext();
  const { data: dataVehicle } = useAllVehicle();
  const { data: dataDestination } = useAllDestinations();
  const { data: dataTravel } = useAllTravelPack();
  const location = useLocation().pathname;
  const { mutateAsync: getRecomendation } = useRecomendations(accessToken!);

  useEffect(() => {
    const fetchDestinations = async () => {
      if (!dataVehicle?.data || !dataDestination?.data) return;
      if (!accessToken || !user) {
        setDestination(dataDestination.data);
      } else {
        try {
          const response = await getRecomendation(user.id);
          if (response?.data?.length) {
            setDestination(response.data);
          } else {
            setDestination(dataDestination.data);
          }
        } catch (err) {
          console.error("Failed to fetch recommendations", err);
          setDestination(dataDestination.data);
        }
      }
    };
    fetchDestinations();
  }, [accessToken, user, dataDestination, dataVehicle, getRecomendation]);
  
  const pageConfigs = {
    "/car-rental": {
      header: <VehicleHeader />,
      mainContent: <VehiclesCarousel vehicles={dataVehicle?.data || []} />,
      searchType: "car-rental" as const,
    },
    "/destination": {
      header: <DestinationHeader />,
      mainContent: <DestinationCarousel popularDestinations={destination} />,
      searchType: null, 
    },
    "/travel": {
      header:< TravelPackHeader/>, 
      mainContent: <TravelPackCarousel travelPack={dataTravel?.data || []} />,
      searchType: "travel" as const,
    },
  };

  const currentPageConfig = pageConfigs[location as keyof typeof pageConfigs];


  if (!dataVehicle?.data || !dataDestination?.data || !dataTravel?.data) {
    return <LoadingSpinner />;
  }

  if (!currentPageConfig) {
     return (
        <div className="min-h-screen w-full">
            <WhyChoosee />
            <Testimonial testimonials={testimonials} />
            <FAQ />
            <Cta />
        </div>
     )
  }

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <div className="mx-4 my-4">
        <div className="bg-[#f0f3f5] w-full p-8 rounded-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8">
              
              {currentPageConfig.header}

              {/* Menu Bar */}
              <div className="flex gap-8 justify-center items-center flex-wrap">
                <MenuBar menuBar={menuBar} />
              </div>

              {/* 2. Render search bar from config */}
              {currentPageConfig.searchType && (
                <DynamicSearchBar pageType={currentPageConfig.searchType} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Render main content from config */}
      {currentPageConfig.mainContent}

      {/* Common Sections that appear on all pages */}
      <WhyChoosee />
      <Testimonial testimonials={testimonials} />
      <FAQ />
      <Cta />
    </div>
  );
}