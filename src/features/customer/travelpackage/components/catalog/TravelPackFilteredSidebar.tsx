// src/features/customer/travelpack/TravelPackFilterSidebar.tsx

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Slider } from "@/shared/components/ui/slider"; 
import { Button } from "@/shared/components/ui/button";
import { Search, Clock, Wallet, RotateCcw } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  durationRange: [number, number];
  setDurationRange: (value: [number, number]) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
}

const currencyFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

export function TravelPackFilterSidebar({
  searchQuery, setSearchQuery, durationRange, setDurationRange, priceRange, setPriceRange,
}: Props) {

  const handleReset = () => {
    setSearchQuery("");
    setDurationRange([1, 30]);
    setPriceRange([0, 5000000]);
  };

  return (
    <aside className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button onClick={handleReset} variant="ghost" size="sm" className="text-xs text-gray-500">
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
      
      {/* Search Filter */}
      <div className="space-y-2">
        <Label htmlFor="search" className="flex items-center gap-2 font-medium"><Search className="w-4 h-4" />Search by Name</Label>
        <Input id="search" placeholder="e.g., 'Ubud Healing'" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* Duration Filter */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 font-medium"><Clock className="w-4 h-4" />Duration</Label>
        <p className="text-sm text-gray-600 text-center font-semibold">{durationRange[0]} - {durationRange[1]} Days</p>
        <Slider
          defaultValue={durationRange}
          onValueChange={(value) => setDurationRange(value as [number, number])}
          max={30}
          min={1}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 font-medium"><Wallet className="w-4 h-4" />Price Range</Label>
        <p className="text-sm text-gray-600 text-center font-semibold">
          {currencyFormatter.format(priceRange[0])} - {currencyFormatter.format(priceRange[1])}
        </p>
        <Slider
          defaultValue={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={5000000} 
          min={0}
          step={50000}
        />
      </div>
    </aside>
  );
}