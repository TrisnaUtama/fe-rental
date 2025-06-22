import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAllTravelPack } from "@/features/admin/protected/travel-pack/hooks/useTravelPack";
import type { ITravelPack } from "@/features/admin/protected/travel-pack/types/travel-pack";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { EmptyStateTravelPackage } from "./EmptyStateTravelPackage";
import { TravelPackFilterSidebar } from "./TravelPackFilteredSidebar";
import { TravelPackCard } from "./TravelPackCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function CatalogTravelPack() {
  const { data: travelPackData, isLoading } = useAllTravelPack();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 30]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000000]); 
  const [sortOption, setSortOption] = useState("price-asc");

  const handleResetFilters = () => {
    setSearchQuery("");
    setDurationRange([1, 30]);
    setPriceRange([0, 6000000]); 
    setSortOption("price-asc");
  };

  const filteredAndSortedPacks = useMemo(() => {
    if (!travelPackData?.data) return [];
    const getStartingPrice = (paxOptions: ITravelPack["pax_options"]) => {
      if (!paxOptions || paxOptions.length === 0) return Infinity;
      return Math.min(...paxOptions.map((p) => parseFloat(p.price.toString())));
    };
    let filtered = travelPackData.data.filter((pack) => {
      const startingPrice = getStartingPrice(pack.pax_options);
      if (
        searchQuery &&
        !pack.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (
        pack.duration < durationRange[0] ||
        pack.duration > durationRange[1]
      ) {
        return false;
      }
      if (startingPrice < priceRange[0] || startingPrice > priceRange[1]) {
        return false;
      }
      return true;
    });
    filtered.sort((a, b) => {
      const priceA = getStartingPrice(a.pax_options);
      const priceB = getStartingPrice(b.pax_options);
      switch (sortOption) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "duration-asc":
          return a.duration - b.duration;
        case "duration-desc":
          return b.duration - a.duration;
        default:
          return 0;
      }
    });
    return filtered;
  }, [travelPackData, searchQuery, durationRange, priceRange, sortOption]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="relative h-80 bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop"
          alt="Beautiful view of Bali"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 p-4 z-1000">
          <Button
            onClick={() => navigate("/travel")}
            className="group text-sm flex bg-transparent items-center gap-2 text-white px-2 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore Our Travel Packages
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-white/90 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find the perfect curated journey through the beautiful landscapes
            and cultures of Bali.
          </motion.p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 py-10">
        <aside className="hidden lg:block lg:col-span-1">
          <TravelPackFilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            durationRange={durationRange}
            setDurationRange={setDurationRange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </aside>

        {/* --- Main Content --- */}
        <main className="lg:col-span-3">
          {/* --- NEW: Consolidated Toolbar --- */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 p-4 bg-white rounded-xl border">
            <h2 className="text-lg font-semibold text-gray-800">
              {filteredAndSortedPacks.length} Packages Found
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile Filter Trigger */}
              <div className="lg:hidden flex-1">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Packages</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <TravelPackFilterSidebar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        durationRange={durationRange}
                        setDurationRange={setDurationRange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              {/* Sort By Dropdown */}
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="duration-asc">
                    Duration: Shortest
                  </SelectItem>
                  <SelectItem value="duration-desc">
                    Duration: Longest
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* --- Results Grid with Animation --- */}
          {filteredAndSortedPacks.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredAndSortedPacks.map((pack) => (
                <TravelPackCard key={pack.id} travelPack={pack} />
              ))}
            </motion.div>
          ) : (
            <div className="py-16">
              <EmptyStateTravelPackage onResetFilters={handleResetFilters} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
