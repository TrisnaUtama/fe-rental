// src/features/customer/travelpack/CatalogTravelPack.tsx

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
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button"; 
import { ArrowLeft } from "lucide-react"; 

export default function CatalogTravelPack() {
  const { data: travelPackData, isLoading } = useAllTravelPack();
  const navigate = useNavigate(); 

  const [searchQuery, setSearchQuery] = useState("");
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 30]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [sortOption, setSortOption] = useState("price-asc");

  const handleResetFilters = () => {
    setSearchQuery("");
    setDurationRange([1, 30]);
    setPriceRange([0, 5000000]);
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
      if (searchQuery && !pack.name.toLowerCase().includes(searchQuery.toLowerCase())) { return false; }
      if (pack.duration < durationRange[0] || pack.duration > durationRange[1]) { return false; }
      if (startingPrice < priceRange[0] || startingPrice > priceRange[1]) { return false; }
      return true;
    });
    filtered.sort((a, b) => {
      const priceA = getStartingPrice(a.pax_options);
      const priceB = getStartingPrice(b.pax_options);
      switch (sortOption) {
        case "price-asc": return priceA - priceB;
        case "price-desc": return priceB - priceA;
        case "duration-asc": return a.duration - b.duration;
        case "duration-desc": return b.duration - a.duration;
        default: return 0;
      }
    });
    return filtered;
  }, [travelPackData, searchQuery, durationRange, priceRange, sortOption]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-start mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/travel")} 
              className="group text-sm flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Explore Our Travel Packages
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
              Find the perfect curated journey through the beautiful landscapes
              and cultures of Bali.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 py-10">
        <aside className="lg:col-span-1">
          <TravelPackFilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            durationRange={durationRange}
            setDurationRange={setDurationRange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredAndSortedPacks.length} Packages Found
            </h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort-by" className="text-sm font-medium">
                Sort by:
              </Label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger id="sort-by" className="w-[180px] bg-white">
                  <SelectValue placeholder="Select order" />
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

          {filteredAndSortedPacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedPacks.map((pack) => (
                <TravelPackCard key={pack.id} travelPack={pack} />
              ))}
            </div>
          ) : (
            <EmptyStateTravelPackage onResetFilters={handleResetFilters} />
          )}
        </main>
      </div>
    </div>
  );
}