import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Heart, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { IDestination } from "@/features/admin/protected/destinations/types/destination.type";

export const DestinationCarousel = ({ popularDestinations }: { popularDestinations: IDestination[] }) => {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section - Unchanged */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Popular Destinations in Bali
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Discover Bali's top attractions, from stunning temples to thrilling water parks.
            </p>
          </div>
          <Link
            to="/destinations"
            className="flex items-center font-semibold text-blue-600 hover:text-blue-800 text-sm md:text-base duration-300 transition-all group"
          >
            Explore all
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
          }}
          navigation
          pagination={{ clickable: true }}
          className="!pb-16"
        >
          {popularDestinations.map((destination) => (
            <SwiperSlide key={destination.id}>
              <Link to={`/destination/${destination.id}`} className="block group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={destination.image_urls?.[0] || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer">
                      <Heart className="h-5 w-5 text-gray-700 group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* UI Improvement: Category Tag */}
                    {destination.category && (
                      <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                        {destination.category}
                      </p>
                    )}

                    {/* Destination Name */}
                    <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-3 flex-grow">
                      {destination.name}
                    </h3>
                    
                    <div className="space-y-3 text-sm text-gray-600 mt-auto">
                        {/* UI Improvement: Address with Icon */}
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{destination.address}</span>
                        </div>
                        {/* UI Improvement: Opening Hours with Icon */}
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                          <span>{destination.open_hour}</span>
                        </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};