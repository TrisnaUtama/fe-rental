import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Slider } from "@/shared/components/ui/slider"; 
import { Button } from "@/shared/components/ui/button";
import { Search, Clock, Wallet, RotateCcw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  durationRange: [number, number];
  setDurationRange: (value: [number, number]) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
}

const currencyFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
const FilterSection = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="py-6 border-b">
      <button 
        className="w-full flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-blue-600"/>
            <h4 className="font-semibold text-gray-800">{title}</h4>
        </div>
        <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
          <ChevronDown className="w-5 h-5 text-gray-500 transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto", marginTop: "20px" },
              collapsed: { opacity: 0, height: 0, marginTop: "0px" },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function TravelPackFilterSidebar({
  searchQuery, setSearchQuery, durationRange, setDurationRange, priceRange, setPriceRange,
}: Props) {

  // Default values
  const defaultDuration: [number, number] = [1, 30];
  const defaultPrice: [number, number] = [0, 6000000];

  const handleReset = () => {
    setSearchQuery("");
    setDurationRange(defaultDuration);
    setPriceRange(defaultPrice);
  };

  return (
    <motion.aside 
        className="sticky top-8 bg-white p-6 rounded-2xl shadow-lg border space-y-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-xl font-bold">Filters</h3>
        <Button onClick={handleReset} variant="ghost" size="sm" className="text-sm text-gray-500 hover:bg-gray-100">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
      </div>
      
      {/* Search Filter */}
      <FilterSection title="Search by Name" icon={Search}>
          <Input id="search" placeholder="e.g., 'Ubud Healing'" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </FilterSection>

      {/* --- NEW: Redesigned Duration Filter --- */}
      <FilterSection title="Duration" icon={Clock}>
        <div className="space-y-4">
            <div className="text-center font-semibold text-lg text-gray-800">
                <span>{durationRange[0]}</span> - <span>{durationRange[1]} Days</span>
            </div>
            <Slider
                value={durationRange}
                onValueChange={(value) => setDurationRange(value as [number, number])}
                max={30}
                min={1}
                step={1}
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>1 Day</span>
                <span>30+ Days</span>
            </div>
        </div>
      </FilterSection>

      {/* --- NEW: Redesigned Price Filter --- */}
      <FilterSection title="Price Range" icon={Wallet}>
        <div className="space-y-4">
            <div className="text-center font-semibold text-lg text-gray-800">
                <span>{currencyFormatter.format(priceRange[0])}</span> - <span>{currencyFormatter.format(priceRange[1])}</span>
            </div>
            <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={defaultPrice[1]} // Using the default max price here
                min={defaultPrice[0]}
                step={100000}
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>{currencyFormatter.format(defaultPrice[0])}</span>
                <span>{currencyFormatter.format(defaultPrice[1])}+</span>
            </div>
        </div>
      </FilterSection>
    </motion.aside>
  );
}