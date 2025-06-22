import { useState, useMemo } from "react";
import { useAllDestinations } from "@/features/admin/protected/destinations/hooks/useDestinations";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { EmptyStateDestination } from "./EmptyState";
import { DestinationFilterSidebar } from "./DestinationFilterSidebar";
import { DestinationCard } from "./DestinationCard";
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
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CatalogDestination() {
  const { data: destinationData, isLoading } = useAllDestinations();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("name-asc");

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("ALL");
    setSortOption("name-asc");
  };

  const uniqueCategories = useMemo(() => {
    if (!destinationData?.data) return [];
    const categories = destinationData.data.map((d) => d.category).filter(Boolean);
    return [...new Set(categories)];
  }, [destinationData]);

  const filteredAndSortedDestinations = useMemo(() => {
    if (!destinationData?.data) return [];

    let filtered = destinationData.data.filter((destination) => {
      if (categoryFilter !== "ALL" && destination.category !== categoryFilter) {
        return false;
      }
      const query = searchQuery.toLowerCase();
      if (
        query &&
        !destination.name.toLowerCase().includes(query) &&
        !destination.address.toLowerCase().includes(query) &&
        !destination.description.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sortOption === "name-asc") return a.name.localeCompare(b.name);
      if (sortOption === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

    return filtered;
  }, [destinationData, searchQuery, categoryFilter, sortOption]);

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
      <header className="relative h-80 bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop"
          alt="Beautiful landscape of Bali"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 p-4 z-10">
          <Button
            onClick={() => navigate("/destination")}
            className="group text-sm flex bg-transparent items-center gap-2 text-white px-2 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover Bali's Destinations
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-white/90 max-w-3xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            From majestic temples and lush rice paddies to vibrant beaches and cultural hubs.
          </motion.p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 py-10">
        <aside className="hidden lg:block lg:col-span-1">
          <DestinationFilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            uniqueCategories={uniqueCategories}
            onReset={handleResetFilters}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 p-4 bg-white rounded-xl border">
            <h2 className="text-lg font-semibold text-gray-800">
              {filteredAndSortedDestinations.length} Destinations Found
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="lg:hidden flex-1">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <SlidersHorizontal className="w-4 h-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader><SheetTitle>Filter Destinations</SheetTitle></SheetHeader>
                    <div className="py-6">
                      <DestinationFilterSidebar
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                        uniqueCategories={uniqueCategories} onReset={handleResetFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredAndSortedDestinations.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredAndSortedDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </motion.div>
          ) : (
             <div className="py-16">
              <EmptyStateDestination onResetFilters={handleResetFilters} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
