import { useState } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { DatePickerWithRange } from "@/shared/components/ui/calender-range";
import { Slider } from "@/shared/components/ui/slider";
import { RotateCcw, ChevronDown, Calendar, Users, Car } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";

const FilterSection = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="py-6 border-b">
      <button className="w-full flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
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
            key="content" initial="collapsed" animate="open" exit="collapsed"
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

function formatVehicleType(type: string) {
  return type.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

interface Props {
  capacityRange: [number, number];
  setCapacityRange: (value: [number, number]) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (value: DateRange | undefined) => void;
  vehicleTypes: string[];
  onResetFilters: () => void;
}

export function FilterSidebar({
  capacityRange, setCapacityRange, typeFilter, setTypeFilter,
  dateRange, setDateRange, vehicleTypes, onResetFilters
}: Props) {

  return (
    <motion.aside 
        className="sticky top-8 bg-white p-6 rounded-2xl shadow-lg border space-y-2"
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-xl font-bold">Filter & Date</h3>
        <Button onClick={onResetFilters} variant="ghost" size="sm" className="text-sm text-gray-500 hover:bg-gray-100">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
      </div>
      
      <FilterSection title="Rent Date" icon={Calendar}>
        <DatePickerWithRange value={dateRange} onChange={setDateRange} />
      </FilterSection>

      <FilterSection title="Capacity" icon={Users}>
        <div className="space-y-4">
            <div className="text-center font-semibold text-lg text-gray-800">
                <span>{capacityRange[0]}</span> - <span>{capacityRange[1]} Seat</span>
            </div>
            <Slider
                value={capacityRange}
                onValueChange={(value) => setCapacityRange(value as [number, number])}
                max={10} min={2} step={1}
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>2</span>
                <span>10+</span>
            </div>
        </div>
      </FilterSection>

      <FilterSection title="Vehicle Type" icon={Car}>
        <Select onValueChange={setTypeFilter} value={typeFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Type</SelectItem>
            {vehicleTypes.map((type) => (
              <SelectItem key={type} value={type}>{formatVehicleType(type)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>
    </motion.aside>
  );
}