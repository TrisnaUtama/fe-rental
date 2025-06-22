import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { useAllVehicle } from "@/features/admin/protected/vehicle/hooks/useVehicle";
import { useAllDestinations } from "@/features/admin/protected/destinations/hooks/useDestinations";
import { useAllTravelPack } from "@/features/admin/protected/travel-pack/hooks/useTravelPack";
import { useRecomendations } from "@/features/customer/destination/hooks/useRecomendations";
import { useAuthContext } from "@/shared/context/authContex";

import LoadingSpinner from "@/features/redirect/pages/Loading";
import { MenuBar } from "@/shared/components/layout/customer/shared/menubar";
import { DynamicSearchBar } from "@/shared/components/layout/customer/shared/searchBar";
import { WhyChooseUs } from "@/shared/components/layout/customer/shared/why-choose-us";
import { Testimonial } from "@/shared/components/layout/customer/shared/testimonials";
import { Cta } from "@/shared/components/layout/customer/shared/cta";
import { FAQ } from "@/shared/components/layout/customer/shared/FAQ";
import { DestinationCarousel } from "../destination/carousel";
import { VehiclesCarousel } from "../vehicle/carousel";
import { TravelPackCarousel } from "../travelpack/carousel";
import type { IDestination } from "@/features/admin/protected/destinations/types/destination.type";
import { CarFront, Palmtree, Map } from "lucide-react";

import {
  HeroHeader,
  DefaultHeader,
} from "@/shared/components/layout/customer/shared/DefaultHeader";

const menuBarData = [
  { label: "Trips", icon: <Map />, path: "/travel" },
  { label: "Car Rental", icon: <CarFront />, path: "/car-rental" },
  { label: "Destinations", icon: <Palmtree />, path: "/destination" },
];

export default function LandingPageLayout() {
  const [recommendedDestinations, setRecommendedDestinations] = useState<IDestination[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const { user, accessToken } = useAuthContext();
  const { data: dataVehicle, isLoading: vLoading } = useAllVehicle();
  const { data: dataDestination, isLoading: dLoading } = useAllDestinations();
  const { data: dataTravel, isLoading: tLoading } = useAllTravelPack();
  const { mutateAsync: getRecomendation } = useRecomendations(accessToken!);

  const location = useLocation().pathname;

  useEffect(() => {
    const fetchDestinations = async () => {
      if (hasFetched || !dataDestination?.data) return;

      if (!accessToken || !user) {
        setRecommendedDestinations(dataDestination.data.slice(0, 8));
        setHasFetched(true);
        return;
      }

      try {
        const response = await getRecomendation(user.id);

        if (response?.data?.length) {
          setRecommendedDestinations(response.data);
        } else {
          setRecommendedDestinations(dataDestination.data.slice(0, 8));
        }
      } catch (err) {
        setRecommendedDestinations(dataDestination.data.slice(0, 8));
      } finally {
        setHasFetched(true);
      }
    };

    fetchDestinations();
  }, [accessToken, user, dataDestination]);

  const pageConfigs = {
    "/": {
      header: (
        <DefaultHeader
          title="Your Adventure Awaits"
          subtitle="Discover Bali's best-kept secrets with personalized recommendations and premium rentals."
        />
      ),
      mainContent: (
        <DestinationCarousel popularDestinations={recommendedDestinations} />
      ),
      searchType: null,
    },
    "/car-rental": {
      header: (
        <HeroHeader
          line1="Find the Perfect"
          highlight="Vehicle"
          line2="for your journey in Bali"
          subtitle="Discover the island with our premium, fully-insured, and reliable vehicles."
        />
      ),
      mainContent: <VehiclesCarousel vehicles={dataVehicle?.data || []} />,
      searchType: "car-rental" as const,
    },
    "/destination": {
      header: (
        <HeroHeader
          line1="Explore Every"
          highlight="Destination"
          line2="the Island of Gods has to offer"
          subtitle="Discover the beauty of Bali with our AI-powered destination recommendations."
        />
      ),
      mainContent: (
        <DestinationCarousel popularDestinations={recommendedDestinations} />
      ),
      searchType: null,
    },
    "/travel": {
      header: (
        <HeroHeader
          line1="Discover Curated"
          highlight="Trips"
          line2="for an unforgettable experience"
          subtitle="Browse our expertly crafted travel packages designed to showcase the best of Bali."
        />
      ),
      mainContent: <TravelPackCarousel travelPack={dataTravel?.data || []} />,
      searchType: null,
    },
  };

  const currentPageConfig =
    pageConfigs[location as keyof typeof pageConfigs] || pageConfigs["/"];

  if (vLoading || dLoading || tLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col items-center justify-center text-white text-center p-4">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1925&auto=format&fit=crop"
          alt="Bali landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <motion.div
          className="relative z-20 flex flex-col items-center w-full max-w-4xl space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {currentPageConfig.header}
          <MenuBar menuBar={menuBarData} />
          {currentPageConfig.searchType && (
            <DynamicSearchBar pageType={currentPageConfig.searchType} />
          )}
        </motion.div>
      </section>

      <main>
        {currentPageConfig.mainContent}
        <WhyChooseUs />
        <Testimonial />
        <FAQ />
        <Cta />
      </main>
    </div>
  );
}
