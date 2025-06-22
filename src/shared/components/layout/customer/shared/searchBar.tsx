import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { motion } from "framer-motion";
import { Search, Calendar, MapPin } from "lucide-react";

import { DatePickerWithRange } from "@/shared/components/ui/calender-range";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/lib/utils";

type PageType = "car-rental" | "travel";

const SearchField = ({
  icon,
  label,
  children,
  className,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "relative flex w-full cursor-pointer items-center gap-4 rounded-full p-4  md:px-6",
      className
    )}
  >
    <div className="flex-shrink-0 text-blue-600">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-bold text-gray-800">{label}</p>
      <div className="text-sm text-gray-600 md:text-base">{children}</div>
    </div>
  </div>
);

export const DynamicSearchBar = ({ pageType }: { pageType: PageType }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (pageType === "car-rental") {
      if (!dateRange?.from || !dateRange?.to) {
        return;
      }
      const from = format(dateRange.from, "yyyy-MM-dd");
      const to = format(dateRange.to, "yyyy-MM-dd");
      navigate(`/rentals?from=${from}&to=${to}`);
    }
  };

  const renderFields = () => {
    if (pageType === "car-rental") {
      return (
        <>
          <div className="w-full flex-1 md:w-auto">
            <SearchField
              icon={<MapPin className="h-6 w-6" />}
              label="Location"
            >
              <p className="font-semibold text-gray-900">Bali, Indonesia</p>
            </SearchField>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full flex-1 md:w-auto md:min-w-[300px]">
                <SearchField
                  icon={<Calendar className="h-6 w-6" />}
                  label="Select Dates"
                >
                  <p className="font-semibold text-gray-900">
                    {dateRange?.from && dateRange.to ? (
                      `${format(dateRange.from, "LLL dd")} - ${format(
                        dateRange.to,
                        "LLL dd, yyyy"
                      )}`
                    ) : (
                      <span className="font-normal text-gray-500">
                        Select your dates
                      </span>
                    )}
                  </p>
                </SearchField>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            </PopoverContent>
          </Popover>
        </>
      );
    }
    return null;
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      <div className="relative flex flex-col items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl md:flex-row md:rounded-full md:divide-x md:gap-0">
        {renderFields()}
        <div className="w-full px-2 md:w-auto md:px-0">
          <Button
            onClick={handleSearch}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 md:h-16 md:w-16 md:rounded-full"
            aria-label="Search"
          >
            <Search className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="md:hidden">Search</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
