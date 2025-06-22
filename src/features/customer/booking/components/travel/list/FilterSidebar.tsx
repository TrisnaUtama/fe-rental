import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { DatePickerWithRange } from "@/shared/components/ui/calender-range";
import { Label } from "@/shared/components/ui/label";
import { Search, X, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { BookingStatus } from "../../../types/booking.type";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
  selectedStatus: BookingStatus | "ALL";
  onStatusChange: (status: BookingStatus | "ALL") => void;
  statusCounts: Record<BookingStatus | "ALL", number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateFilter?: DateRange;
  onDateChange: (dateRange?: DateRange) => void;
  onClearFilters: () => void;
  isFilterActive: boolean;
}

const allStatuses: Array<{ value: BookingStatus | "ALL"; label: string }> = [
    { value: "ALL", label: "All Bookings" },
    { value: "SUBMITTED", label: "Submitted" },
    { value: "PAYMENT_PENDING", label: "Payment Pending" },
    { value: "RECEIVED", label: "Received" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "COMPLETE", label: "Complete" },
    { value: "CANCELED", label: "Canceled" },
    { value: "REJECTED_BOOKING", label: "Rejected Booking" },
    { value: "REJECTED_REFUND", label: "Rejected Refund" },
    { value: "REJECTED_RESHEDULE", label: "Rejected Reschedule" },
    { value: "RESCHEDULE_REQUESTED", label: "Reschedule Request" },
    { value: "RESCHEDULED", label: "Rescheduled" },
    { value: "REFUND_REQUESTED", label: "Refund Request" },
    { value: "REFUNDED", label: "Refunded" },
];

const primaryStatusValues: Array<BookingStatus | "ALL"> = ["ALL", "PAYMENT_PENDING", "CONFIRMED", "COMPLETE"];

const FilterButton = ({ label, count, isActive, onClick }: { label: string, count: number, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex justify-between items-center px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
    >
        <span>{label}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {count || 0}
        </span>
    </button>
);


export function FilterSidebar({
  selectedStatus, onStatusChange, statusCounts,
  searchQuery, onSearchChange,
  dateFilter, onDateChange,
  onClearFilters, isFilterActive
}: FilterSidebarProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const primaryOptions = allStatuses.filter(s => primaryStatusValues.includes(s.value));
  const secondaryOptions = allStatuses.filter(s => !primaryStatusValues.includes(s.value));

  // Check if the active filter is in the "More" section
  const isSecondaryActive = secondaryOptions.some(opt => opt.value === selectedStatus);

  return (
    <aside className="space-y-6">
      {/* Search Filter */}
      <div>
        <Label htmlFor="search-query" className="font-semibold">Search</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id="search-query"
            placeholder="Package Name / ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 h-11 text-base bg-white border-gray-300 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Date Filter */}
      <div>
        <Label htmlFor="date-filter" className="font-semibold ">Filter by Date</Label>
        <div className="mt-2">
          <DatePickerWithRange value={dateFilter} onChange={onDateChange} />
        </div>
      </div>

      {/* Status Filter Section */}
      <div>
        <h3 className="font-semibold mb-2">Status</h3>
        <ul className="space-y-1">
          {primaryOptions.map(option => (
            <li key={option.value}>
              <FilterButton
                label={option.label}
                count={statusCounts[option.value] || 0}
                isActive={selectedStatus === option.value}
                onClick={() => onStatusChange(option.value)}
              />
            </li>
          ))}
        </ul>

        {/* --- NEW: Collapsible "More Statuses" section --- */}
        <div className="mt-2">
            <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`w-full flex justify-between items-center px-3 py-2 text-sm rounded-md font-semibold ${isSecondaryActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <span>More Statuses</span>
                <motion.div animate={{ rotate: isMoreOpen ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isMoreOpen && (
                    <motion.ul 
                        className="space-y-1 mt-1 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {secondaryOptions.map(option => (
                            <li key={option.value}>
                                <FilterButton
                                    label={option.label}
                                    count={statusCounts[option.value] || 0}
                                    isActive={selectedStatus === option.value}
                                    onClick={() => onStatusChange(option.value)}
                                />
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Clear Filters Button */}
      {isFilterActive && (
        <div className="pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="w-full text-gray-600">
                <X className="w-4 h-4 mr-2"/> Clear All Filters
            </Button>
        </div>
      )}
    </aside>
  );
}