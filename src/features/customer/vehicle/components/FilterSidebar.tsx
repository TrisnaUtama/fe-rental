import { Filter, Users, Car, ArrowDownUp, RotateCcw, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { DatePickerWithRange } from "@/shared/components/ui/calender-range";
import type { DateRange } from "react-day-picker";
import { Button } from "@/shared/components/ui/button";

const vehicleTypes = [
  "CITY_CAR", "HATCHBACK", "SEDAN", "SUV", "MPV", 
  "MINIVAN", "PICKUP", "DOUBLE_CABIN", "LUXURY", "ELECTRIC_CAR",
];

function formatVehicleType(type: string) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

interface Props {
  capacityFilter: string;
  setCapacityFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  dateRange: DateRange | undefined;
  setDateRange: (value: DateRange | undefined) => void;
}

export function FilterSidebar({
  capacityFilter, setCapacityFilter, typeFilter, setTypeFilter,
  sortOrder, setSortOrder, dateRange, setDateRange
}: Props) {

  const handleResetFilters = () => {
    setCapacityFilter("all");
    setTypeFilter("all");
    setSortOrder("asc");
  };

  return (
    <aside className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Filters &amp; Dates</h3>
        </div>
        {/* Tombol Reset Filter */}
        <Button onClick={handleResetFilters} variant="ghost" size="sm" className="text-xs text-gray-500 hover:bg-gray-100">
          <RotateCcw className="w-3 h-3 mr-1"/>
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        {/* Filter Tanggal */}
        <div className="space-y-2">
          <Label htmlFor="date-range" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400"/>
            Rental Dates
          </Label>
          <DatePickerWithRange value={dateRange} onChange={setDateRange} />
        </div>

        <hr /> 

        {/* Filter Spesifikasi Kendaraan */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="capacity" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4 text-gray-400"/>
              Capacity
            </Label>
            <Select onValueChange={setCapacityFilter} value={capacityFilter}>
              <SelectTrigger id="capacity" className="w-full">
                <SelectValue placeholder="Select Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Capacities</SelectItem>
                <SelectItem value="4">4+ Seats</SelectItem>
                <SelectItem value="6">6+ Seats</SelectItem>
                <SelectItem value="8">8+ Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Car className="w-4 h-4 text-gray-400"/>
              Vehicle Type
            </Label>
            <Select onValueChange={setTypeFilter} value={typeFilter}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {formatVehicleType(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <hr />

        {/* Filter Urutan Harga */}
        <div className="space-y-2">
          <Label htmlFor="sort" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ArrowDownUp className="w-4 h-4 text-gray-400"/>
            Sort by Price
          </Label>
          <Select
            onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
            value={sortOrder}
          >
            <SelectTrigger id="sort" className="w-full">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Cheapest to Luxury</SelectItem>
              <SelectItem value="desc">Luxury to Cheapest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}