import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { IVehicle } from "@/features/admin/protected/vehicle/types/vehicle.type";
import { VehicleCard } from "./CardVehicle";
import type { DateRange } from "react-day-picker";
import { useGetAllAvailableVehicle } from "../../booking/hooks/useBooking";
import CartSummary from "./CartSumary"; 
import { formatDate } from "@/shared/utils/format-date";
import { useCart } from "@/shared/context/cartContext";

import { FilterSidebar } from "./FilterSidebar";
import { FloatingCartButton } from "./FloatingCartButton";
import { CartDrawer } from "./CartDrawer";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { EmptyStateVehicle } from "./EmptyStateVehicle";
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
import { motion } from "framer-motion";

const vehicleTypes = [
  "CITY_CAR", "HATCHBACK", "SEDAN", "SUV", "MPV",
  "MINIVAN", "PICKUP", "DOUBLE_CABIN", "LUXURY", "ELECTRIC_CAR",
];

export default function CatalogVehicle() {
  const [capacityRange, setCapacityRange] = useState<[number, number]>([2, 10]);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("price-asc");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [vehiclesFiltered, setVehicleFiltered] = useState<IVehicle[] | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutateAsync: fetchAvailableVehicles, isPending: isLoadingVehicles } = useGetAllAvailableVehicle();

  useEffect(() => {
    return () => clearCart();
  }, [clearCart]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get("from");
    const to = params.get("to");
    if (from && to) {
      setDateRange({ from: new Date(from), to: new Date(to) });
    } else {
      const today = new Date();
      const nextDay = new Date(today);
      today.setDate(today.getDate() +1)
      nextDay.setDate(today.getDate() + 1);
      setDateRange({ from: today, to: nextDay });
    }
  }, [location.search]);

  useEffect(() => {
    async function fetchData() {
      if (!dateRange?.from || !dateRange?.to) return;
      const startDateStr = formatDate(dateRange.from);
      const endDateStr = formatDate(dateRange.to);
      try {
        const { data } = await fetchAvailableVehicles({ start_date: startDateStr, end_date: endDateStr });
        setVehicleFiltered(Array.isArray(data) && data.length ? data : []);
      } catch (error) {
        setVehicleFiltered([]);
      }
    }
    fetchData();
  }, [dateRange, fetchAvailableVehicles]);

  const handleResetFilters = () => {
      setCapacityRange([2, 10]);
      setTypeFilter("all");
      setSortOption("price-asc");
  };
  
  const filteredAndSortedVehicles = useMemo(() => {
    if (!vehiclesFiltered) return [];
    let result = [...vehiclesFiltered];
    result = result.filter((v) => v.capacity >= capacityRange[0] && v.capacity <= capacityRange[1]);
    if (typeFilter !== "all") result = result.filter((v) => v.type === typeFilter);
    result.sort((a, b) => {
        const priceA = Number(a.price_per_day);
        const priceB = Number(b.price_per_day);
        switch (sortOption) {
            case "price-asc": return priceA - priceB;
            case "price-desc": return priceB - priceA;
            case "capacity-asc": return a.capacity - b.capacity;
            case "capacity-desc": return b.capacity - a.capacity;
            default: return 0;
        }
    });
    return result;
  }, [vehiclesFiltered, capacityRange, typeFilter, sortOption]);

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="relative h-80 bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2071&auto=format&fit=crop"
          alt="Scenic road with a car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 left-0 p-4 z-10">
          <Button
            onClick={() => navigate("/car-rental")}
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
            Find Your Perfect Vehicle
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-white/90 max-w-3xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            Select your dates and apply filters to see available vehicles for your trip.
          </motion.p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 py-10">
        <aside className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            capacityRange={capacityRange}
            setCapacityRange={setCapacityRange}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            vehicleTypes={vehicleTypes}
            onResetFilters={handleResetFilters}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 p-4 bg-white rounded-xl border">
            <h2 className="text-lg font-semibold text-gray-800">
              {isLoadingVehicles ? "Searching..." : `${filteredAndSortedVehicles.length} Vehicles Found`}
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="lg:hidden flex-1">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters & Dates
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader><SheetTitle>Filter Vehicles</SheetTitle></SheetHeader>
                    <div className="py-6">
                      <FilterSidebar
                        capacityRange={capacityRange} setCapacityRange={setCapacityRange}
                        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                        dateRange={dateRange} setDateRange={setDateRange}
                        vehicleTypes={vehicleTypes} onResetFilters={handleResetFilters}
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
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="capacity-desc">Capacity: High to Low</SelectItem>
                  <SelectItem value="capacity-asc">Capacity: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoadingVehicles ? (
            <LoadingSpinner />
          ) : filteredAndSortedVehicles.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={gridContainerVariants} initial="hidden" animate="visible"
            >
              {filteredAndSortedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} dateRange={dateRange!} />
              ))}
            </motion.div>
          ) : (
            <div className="py-16">
              <EmptyStateVehicle onResetFilters={handleResetFilters} />
            </div>
          )}
        </main>
      </div>

      <FloatingCartButton cartCount={cart.length} onClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <CartSummary />
      </CartDrawer>
    </div>
  );
}
