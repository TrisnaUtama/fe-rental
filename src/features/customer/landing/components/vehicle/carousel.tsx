import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import {
  Users,
  Fuel,
  Cog,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { IVehicle } from "../../types/vehicle.type";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import 'swiper/swiper-bundle.css';

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const SpecItem = ({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <Icon className="w-4 h-4 text-gray-400" />
    <span>{value}</span>
  </div>
);

const VehicleCard = ({ vehicle }: { vehicle: IVehicle }) => {
  return (
    <Link to={`/rentals`} className="block group h-full">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={vehicle.image_url?.[0] || "/placeholder.svg"}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div>
            <p className="text-sm text-gray-500 mb-1">{vehicle.brand}</p>
            <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-1 group-hover:text-blue-600">
              {vehicle.name}
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
              <SpecItem icon={Users} value={`${vehicle.capacity} Seats`} />
              <SpecItem icon={Cog} value={vehicle.transmition.toLowerCase()} />
              <SpecItem icon={Fuel} value={vehicle.fuel.toLowerCase()} />
              <SpecItem icon={CalendarDays} value={vehicle.year.toString()} />
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-dashed flex justify-between items-center">
            <p className="text-xl font-bold text-gray-900">
              {idrFormatter.format(Number(vehicle.price_per_day))}
              <span className="text-sm font-normal text-gray-500"> /day</span>
            </p>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export const VehiclesCarousel = ({ vehicles }: { vehicles: IVehicle[] }) => {
  return (
    <motion.section
      className="bg-white py-20 px-4 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Our Vehicle Fleet
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Choose the perfect vehicle for your Bali adventure.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="vehicle-carousel-prev rounded-full w-11 h-11 border-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="vehicle-carousel-next rounded-full w-11 h-11 border-2"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={30}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 30 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
          }}
          navigation={{
            nextEl: ".vehicle-carousel-next",
            prevEl: ".vehicle-carousel-prev",
          }}
          pagination={{ clickable: true, el: ".vehicle-carousel-pagination" }}
          className="vehicle-carousel"
          speed={600}
        >
          {vehicles.map((vehicle) => (
            <SwiperSlide key={vehicle.id} className="h-full pb-12">
              <VehicleCard vehicle={vehicle} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center md:justify-between items-center mt-8">
          <Link
            to="/rentals"
            className="hidden md:flex items-center font-semibold text-blue-600 hover:text-blue-800 duration-300 transition-all group"
          >
            Explore all Vehicles{" "}
            <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="vehicle-carousel-pagination !relative !bottom-0 !top-0 !w-auto"></div>
          <div className="hidden md:block w-[185px]"></div>
        </div>
      </div>
    </motion.section>
  );
};
