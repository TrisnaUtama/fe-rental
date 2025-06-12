import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import type { IVehicle } from "@/features/admin/protected/vehicle/types/vehicle.type";
import { VehicleCard } from "./CardVehicle";
import type { DateRange } from "react-day-picker";
import { useGetAllAvailableVehicle } from "../../booking/hooks/useBooking";
import CartSummary from "./CardSumary";
import { formatDate } from "@/shared/utils/format-date";
import { useCart } from "@/shared/context/cartContext";

import { FilterSidebar } from "./FilterSidebar";
import { FloatingCartButton } from "./FloatingCartButton";
import { CartDrawer } from "./CartDrawer";
import { Button } from "@/shared/components/ui/button"; 
import { ArrowLeft } from "lucide-react"; 
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function CatalogVehicle() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [vehiclesFiltered, setVehicleFiltered] = useState<IVehicle[] | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate(); 
  const { mutateAsync: fetchAvailableVehicles, isPending: isLoadingVehicles } = useGetAllAvailableVehicle();

  useEffect(() => {
        return () => {
            clearCart();
        };
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
        console.error("Failed to fetch available vehicles:", error);
        setVehicleFiltered([]);
      }
    }
    fetchData();
  }, [dateRange, fetchAvailableVehicles]);

  const filteredVehicles = useMemo(() => {
    if (!vehiclesFiltered) return [];
    let result = [...vehiclesFiltered];
    if (capacityFilter !== "all") result = result.filter((v) => v.capacity >= Number(capacityFilter));
    if (typeFilter !== "all") result = result.filter((v) => v.type === typeFilter);
    result.sort((a, b) => sortOrder === "asc" ? Number(a.price_per_day) - Number(b.price_per_day) : Number(b.price_per_day) - Number(a.price_per_day));
    return result;
  }, [vehiclesFiltered, capacityFilter, typeFilter, sortOrder]);


  return (
    <div className="min-h-screen w-full bg-gray-50">
        <header className="bg-white border-b py-6">
            <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex justify-start mb-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/car-rental')} 
                    className="group text-sm flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 hover:bg-gray-100"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </Button>
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">
                    Find the Perfect Vehicle
                </h1>
                <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
                    Select your dates and filters to see available vehicles for your trip.
                </p>
            </div>
            </div>
        </header>

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 py-10">
        <aside className="lg:col-span-1">
          <FilterSidebar
            capacityFilter={capacityFilter}
            setCapacityFilter={setCapacityFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="space-y-4">
            {isLoadingVehicles ? (
                <div className="">
                    <LoadingSpinner />
                </div>
            ) : filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <VehicleCard
                  dateRange={dateRange!}
                  key={vehicle.id}
                  vehicle={vehicle}
                  onSelect={setSelectedVehicleId}
                  selected={selectedVehicleId === vehicle.id}
                />
              ))
            ) : (
              <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold">No Vehicles Found</h3>
                <p className="text-sm mt-1">Try adjusting your dates or filters to find available cars.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <FloatingCartButton cartCount={cart.length} onClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <CartSummary />
      </CartDrawer>
    </div>
  );
}
