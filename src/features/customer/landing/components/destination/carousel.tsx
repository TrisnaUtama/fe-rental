import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Parallax, A11y } from "swiper/modules";
import {  MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { IDestination } from "@/features/admin/protected/destinations/types/destination.type";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import 'swiper/swiper-bundle.css';

const DestinationCard = ({ destination }: { destination: IDestination }) => {
  return (
    <Link to={`/destination/${destination.id}`} className="block group">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg">
        <div
          data-swiper-parallax="-23%"
          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
        >
          <img
            src={destination.image_urls[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
           <h3 data-swiper-parallax="-300" className="text-2xl font-bold tracking-tight">
             {destination.name}
           </h3>
           <p data-swiper-parallax="-200" className="text-white/80 mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
             {destination.address}
           </p>
        </div>
      </div>
    </Link>
  );
};

export const DestinationCarousel = ({ popularDestinations, title = "Popular Destinations in Bali", subtitle = "Discover Bali's top attractions, from stunning temples to thrilling water parks." }: { popularDestinations: IDestination[], title?: string, subtitle?: string }) => {
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
              {title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-xl">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
             <Button variant="outline" size="icon" className="destination-carousel-prev rounded-full w-11 h-11 border-2">
                <ArrowLeft className="w-5 h-5"/>
             </Button>
              <Button variant="outline" size="icon" className="destination-carousel-next rounded-full w-11 h-11 border-2">
                <ArrowRight className="w-5 h-5"/>
             </Button>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Parallax, A11y]}
          spaceBetween={30}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3.5, spaceBetween: 30 },
          }}
          navigation={{
            nextEl: '.destination-carousel-next',
            prevEl: '.destination-carousel-prev',
          }}
          pagination={{ clickable: true, el: '.destination-carousel-pagination' }}
          className="destination-carousel"
          parallax={true}
          speed={600}
        >
          {popularDestinations.map((destination) => (
            <SwiperSlide key={destination.id}>
              <DestinationCard destination={destination}/>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex justify-center md:justify-between items-center mt-8">
            <Link
                to="/destinations"
                className="hidden md:flex items-center font-semibold text-blue-600 hover:text-blue-800 duration-300 transition-all group"
            >
                Explore all Destinations
                <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="destination-carousel-pagination !relative !bottom-0 !top-0 !w-auto"></div>
            <div className="hidden md:block w-[205px]"></div> 
        </div>
      </div>
    </motion.section>
  );
};