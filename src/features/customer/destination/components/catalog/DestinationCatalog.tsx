import { useState, useMemo } from "react";
import { useAllDestinations } from "@/features/admin/protected/destinations/hooks/useDestinations";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { EmptyStateTravelPackage } from "../../../travelpackage/components/catalog/EmptyStateTravelPackage";
import { DestinationFilterSidebar } from "./DestinationFilterSidebar";
import { DestinationCard } from "./DestinationCard";
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
import { useNavigate } from "react-router-dom";

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
    const categories = destinationData.data
      .map((d) => d.category)
      .filter(Boolean);
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
      if (sortOption === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return filtered;
  }, [destinationData, searchQuery, categoryFilter, sortOption]);

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
              onClick={() => navigate("/destination")}
              className="group text-sm flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Discover Bali's Destinations
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
              From majestic temples and lush rice paddies to vibrant beaches and
              cultural hubs.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 py-10">
        <aside className="lg:col-span-1">
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredAndSortedDestinations.length} Destinations Found
            </h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort-by" className="text-sm font-medium">
                Sort by:
              </Label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger id="sort-by" className="w-[180px] bg-white">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredAndSortedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                />
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
