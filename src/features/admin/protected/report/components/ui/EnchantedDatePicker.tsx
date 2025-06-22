import { Calendar } from "lucide-react";
import type { DateRange } from "../../types/report";

// Update the props interface to include an optional 'disabled' boolean
export const EnhancedDatePicker = ({
  date,
  onDateChange,
  disabled = false,
}: {
  date: DateRange;
  onDateChange: (date: DateRange) => void;
  disabled?: boolean; 
}) => {
  const handleDateChange = (field: "from" | "to", value: string) => {
    const newDate = value ? new Date(value) : null;
    onDateChange({ ...date, [field]: newDate });
  };
  const formatDate = (d: Date | null) => {
    if (!d) return "";
    const year = d.getUTCFullYear();
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = d.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="relative flex items-center w-full">
        <Calendar className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <input
            type="date"
            value={formatDate(date?.from)}
            onChange={(e) => handleDateChange("from", e.target.value)}
            className="relative w-full p-2 pl-10 border border-gray-300 rounded-l-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={disabled} 
        />
        <span className="px-3 py-2 border-t border-b border-gray-300 bg-gray-50 text-gray-500">-</span>
        <input
            type="date"
            value={formatDate(date?.to)}
            onChange={(e) => handleDateChange("to", e.target.value)}
            className="w-full p-2 pr-3 border-r border-t border-b border-gray-300 rounded-r-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={disabled}
        />
    </div>
  );
};