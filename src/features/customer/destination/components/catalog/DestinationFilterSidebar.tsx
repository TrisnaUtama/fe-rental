import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Search, RotateCcw, LayoutGrid } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  uniqueCategories: string[];
  onReset: () => void;
}

export function DestinationFilterSidebar({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  uniqueCategories,
  onReset,
}: Props) {
  return (
    <aside className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button onClick={onReset} variant="ghost" size="sm" className="text-xs text-gray-500">
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
      
      {/* Search Filter */}
      <div className="space-y-2">
        <Label htmlFor="search" className="flex items-center gap-2 font-medium">
          <Search className="w-4 h-4" /> Search
        </Label>
        <Input
          id="search"
          placeholder="e.g., 'Uluwatu', 'beach'..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label htmlFor="category" className="flex items-center gap-2 font-medium">
          <LayoutGrid className="w-4 h-4" /> Category
        </Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
