import { Button } from "@/shared/components/ui/button";
import { Compass, RotateCcw } from "lucide-react";

interface EmptyStateDestinationProps {
  onResetFilters: () => void;
}

export function EmptyStateDestination({ onResetFilters }: EmptyStateDestinationProps) {
  return (
    <div className="bg-white rounded-2xl flex flex-col items-center justify-center py-20 px-6 text-center border">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5 border-4 border-white shadow-inner">
        <Compass className="w-10 h-10 text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        No Matching Destinations Found
      </h3>
      <p className="text-gray-500 mb-8 max-w-md">
        We couldn't find any places matching your current filters. Try adjusting your search to discover new adventures.
      </p>
      <Button 
        onClick={onResetFilters} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-semibold transition-transform hover:scale-105"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  );
}
