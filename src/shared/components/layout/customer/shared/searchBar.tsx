// src/shared/components/layout/customer/shared/searchBar.tsx
import { DatePickerWithRange } from "@/shared/components/ui/calender-range";
import { format } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Users, MapPin } from "lucide-react";

type PageType = "car-rental" | "travel";

export const DynamicSearchBar = ({ pageType }: { pageType: PageType }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [keyword, setKeyword] = useState("");
  const [pax, setPax] = useState<number>(2);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (pageType === "car-rental") {
      if (!dateRange?.from || !dateRange?.to) return;
      const from = format(dateRange.from, "yyyy-MM-dd");
      const to = format(dateRange.to, "yyyy-MM-dd");
      navigate(`/rentals?from=${from}&to=${to}`);
    } else if (pageType === "travel") {
      // Logic for travel search can be implemented here
      // For now, it can navigate or filter on the client side
      navigate(`/travel?q=${keyword}&pax=${pax}`);
    }
  };

  const renderFields = () => {
    if (pageType === "car-rental") {
      return (
        <>
          <div className="flex-1">
            <label className="flex items-center text-sm font-medium text-gray-500 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Pick-up & Drop-off Dates
            </label>
            <DatePickerWithRange
              className="w-full justify-start text-left font-normal"
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        </>
      );
    }

    if (pageType === "travel") {
      return (
        <>
          <div className="flex-1">
            <label className="flex items-center text-sm font-medium text-gray-500 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Keywords
            </label>
            <input
              type="text"
              placeholder="e.g., 'Ubud', 'beach', 'temple'"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="w-48">
            <label className="flex items-center text-sm font-medium text-gray-500 mb-2">
              <Users className="h-4 w-4 mr-2" />
              Number of Travelers
            </label>
            <input
              type="number"
              min="1"
              value={pax}
              onChange={(e) => setPax(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </>
      );
    }
    return null;
  };
  
  const buttonText = pageType === 'car-rental' ? 'Search Vehicles' : 'Search Trips';

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl max-w-4xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row items-end justify-center gap-4">
        {renderFields()}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Search className="h-5 w-5" />
          {buttonText}
        </button>
      </div>
    </div>
  );
};