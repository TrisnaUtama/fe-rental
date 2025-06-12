import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Users, Fuel, Cog, CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { IVehicle } from "../../types/vehicle.type";

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const VehiclesCarousel = ({ vehicles }: { vehicles: IVehicle[] }) => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Our Vehicle Fleet
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Choose the perfect vehicle for your Bali adventure.
            </p>
          </div>
          <Link
            to="/rentals"
            className="flex items-center font-semibold text-blue-600 hover:text-blue-800 text-sm md:text-base duration-300 transition-all group"
          >
            Explore all
            <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

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
          {vehicles.map((vehicle) => (
            <SwiperSlide key={vehicle.id}>
              <Link
                to={`/rentals`}
                className="block group h-full"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full border border-transparent hover:border-blue-500">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={vehicle.image_url?.[0] || "/placeholder.svg"}
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg">
                      {vehicle.type.replace("_", " ")}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-sm text-gray-500 mb-1">
                      {vehicle.brand}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">
                      {vehicle.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700 mb-6">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{vehicle.capacity} Seats</span>
                      </div>
                      <div className="flex items-center capitalize">
                        <Cog className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{vehicle.transmition.toLowerCase()}</span>
                      </div>
                      <div className="flex items-center capitalize">
                        <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{vehicle.fuel.toLowerCase()}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{vehicle.year}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <p className="text-xl font-bold text-gray-900">
                          {idrFormatter.format(Number(vehicle.price_per_day))}
                          <span className="text-sm font-normal text-gray-500">
                            /day
                          </span>
                        </p>
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
