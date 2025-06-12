import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Heart, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ITravelPack } from "@/features/admin/protected/travel-pack/types/travel-pack";

const getStartingPrice = (paxOptions: ITravelPack["pax_options"]) => {
  if (!paxOptions || paxOptions.length === 0) {
    return null;
  }
  const lowestPrice = Math.min(
    ...paxOptions.map((p) => parseFloat(p.price.toString()))
  );
  return lowestPrice;
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export const TravelPackCarousel = ({
  travelPack,
}: {
  travelPack: ITravelPack[];
}) => {
  return (
    <section className=" py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Travel Packages We Offer
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Explore the most beautiful places with our curated Travel
              Packages.
            </p>
          </div>
          <Link
            to="/travels"
            className="flex items-center font-semibold text-blue-600 hover:text-blue-800 text-sm md:text-base duration-300 transition-all group"
          >
            Explore more
            <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4 },
          }}
          navigation
          pagination={{ clickable: true }}
          className="!pb-16"
        >
          {travelPack.map((travel) => {
            const startingPrice = getStartingPrice(travel.pax_options);

            return (
              <SwiperSlide key={travel.id}>
                <Link to={`/travel/${travel.id}`} className="block group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={travel.image || "/placeholder.svg"}
                        alt={travel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                      />
                      <div className="absolute top-0 right-0 p-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer">
                          <Heart className="h-5 w-5 text-gray-700 group-hover:text-red-500 transition-colors" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-tr-xl">
                        {travel.duration} {travel.duration > 1 ? "Days" : "Day"}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-xl text-gray-800 line-clamp-1 mb-3">
                        {travel.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                          {travel.travel_package_destinations?.length || 0}{" "}
                          Destinations Included
                        </span>
                      </div>

                      {/* UI/UX Improvement: Price Display */}
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {startingPrice
                              ? currencyFormatter.format(startingPrice)
                              : "N/A"}
                          </p>
                        </div>
                        <div className="text-blue-600 font-semibold group-hover:underline">
                          Details
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};
