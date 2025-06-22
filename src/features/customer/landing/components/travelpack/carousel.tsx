import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Parallax, A11y } from "swiper/modules";
import {  ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { ITravelPack } from "@/features/admin/protected/travel-pack/types/travel-pack";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import 'swiper/swiper-bundle.css';

const currencyFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

const getStartingPrice = (paxOptions: ITravelPack["pax_options"]) => {
  if (!paxOptions || paxOptions.length === 0) return null;
  return Math.min(...paxOptions.map((p) => parseFloat(p.price.toString())));
};

const TravelPackCard = ({ travelPack }: { travelPack: ITravelPack }) => {
    const startingPrice = getStartingPrice(travelPack.pax_options);
    return (
        <Link to={`/travel/${travelPack.id}`} className="block group">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg">
                <div data-swiper-parallax="-23%" className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                    <img src={travelPack.image} alt={travelPack.name} className="w-full h-full object-cover"/>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <div data-swiper-parallax="-100" className="flex items-center gap-2 text-xs">
                        <span className="bg-blue-600 px-2 py-1 rounded-full font-semibold">{travelPack.duration} Days</span>
                        <span className="bg-black/40 px-2 py-1 rounded-full font-semibold">{travelPack.travel_package_destinations?.length} Stops</span>
                    </div>
                    <h3 data-swiper-parallax="-200" className="text-2xl font-bold tracking-tight mt-3">{travelPack.name}</h3>
                    <div data-swiper-parallax="-300" className="mt-4">
                        <p className="text-sm text-white/80">From</p>
                        <p className="text-xl font-bold">{startingPrice ? currencyFormatter.format(startingPrice) : "N/A"}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export const TravelPackCarousel = ({ travelPack }: { travelPack: ITravelPack[] }) => {
  return (
    <motion.section 
        className="bg-gray-50 py-20 px-4 overflow-hidden"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Travel Packages We Offer</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-xl">Explore the most beautiful places with our curated Travel Packages.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
             <Button variant="outline" size="icon" className="travel-pack-carousel-prev rounded-full w-11 h-11 border-2"><ArrowLeft className="w-5 h-5"/></Button>
             <Button variant="outline" size="icon" className="travel-pack-carousel-next rounded-full w-11 h-11 border-2"><ArrowRight className="w-5 h-5"/></Button>
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
          navigation={{ nextEl: '.travel-pack-carousel-next', prevEl: '.travel-pack-carousel-prev' }}
          pagination={{ clickable: true, el: '.travel-pack-carousel-pagination' }}
          className="travel-pack-carousel"
          parallax={true}
          speed={600}
        >
          {travelPack.map((pack) => (
            <SwiperSlide key={pack.id}>
              <TravelPackCard travelPack={pack}/>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="flex justify-center md:justify-between items-center mt-8">
            <Link to="/travels" className="hidden md:flex items-center font-semibold text-blue-600 hover:text-blue-800 duration-300 transition-all group">
                Explore all Packages <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="travel-pack-carousel-pagination !relative !bottom-0 !top-0 !w-auto"></div>
            <div className="hidden md:block w-[205px]"></div>
        </div>
      </div>
    </motion.section>
  );
};