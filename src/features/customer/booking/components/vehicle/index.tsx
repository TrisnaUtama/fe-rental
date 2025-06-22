import { useState, useMemo } from "react";
import { BookingCard } from "./list/BookingCard";
import { FilterTabs } from "./list/FilterTabs";
import { EmptyState } from "./list/EmptyState";
import type { BookingStatus } from "../../types/booking.type";
import { ArrowLeft, Search, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useAllBookingUser } from "../../hooks/useBooking";
import { useAuthContext } from "@/shared/context/authContex";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { useNavigate } from "react-router-dom";
import { DatePickerWithRange } from "@/shared/components/ui/calender-range"; 
import type { DateRange } from "react-day-picker";
import { Label } from "@/shared/components/ui/label";

export default function BookingHistory() {
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();
  
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);

  const { data: bookingData, isLoading } = useAllBookingUser(accessToken! || "");

  const filteredBookings = useMemo(() => {
    if (!bookingData?.data) return [];
    const query = searchQuery.toLowerCase().trim();
    const filtered = bookingData.data.filter((booking) => {
      if (booking.travel_package_id) {
        return false;
      }
      if (selectedStatus !== "ALL" && booking.status !== selectedStatus) {
        return false;
      }
      if (dateFilter?.from && dateFilter?.to) {
        const bookingStart = new Date(booking.start_date);
        const bookingEnd = new Date(booking.end_date!);
        const filterStart = new Date(dateFilter.from);
        filterStart.setHours(0, 0, 0, 0);
        const filterEnd = new Date(dateFilter.to);
        filterEnd.setHours(23, 59, 59, 999);
        if (!(bookingStart <= filterEnd && bookingEnd >= filterStart)) {
          return false;
        }
      }

      if (query) {
        const hasMatchingText =
          booking.id.toLowerCase().includes(query) ||
          booking.booking_vehicles?.some(({ vehicle }) =>
            vehicle.name.toLowerCase().includes(query) ||
            vehicle.brand.toLowerCase().includes(query) ||
            vehicle.type.toLowerCase().includes(query)
          );
        
        if (!hasMatchingText) {
          return false;
        }
      }

      return true;
    });

    return filtered ?? [];
  }, [bookingData, selectedStatus, searchQuery, dateFilter]);

  const statusCounts = useMemo(() => {
    if (!bookingData?.data) {
        return { ALL: 0 } as Record<BookingStatus | "ALL", number>;
    }
    const vehicleBookings = bookingData.data.filter(b => !b.travel_package_id);

    const counts = vehicleBookings.reduce((acc, booking) => {
      const status = booking.status as BookingStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<BookingStatus, number>);

    return {
      ALL: vehicleBookings.length,
      ...counts,
    } as Record<BookingStatus | "ALL", number>;
  }, [bookingData]);


  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  const handleClearFilters = () => {
      setSearchQuery("");
      setDateFilter(undefined);
  }
  const isFilterActive = searchQuery.trim() !== "" || dateFilter !== undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/car-rental")} className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">My Vehicle Bookings</h1>
            </div>
            {isFilterActive && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs text-gray-500">
                    <X className="w-3 h-3 mr-1"/> Clear Filters
                </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="search-query" className="text-xs font-medium text-gray-600">Search by Name / ID</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="search-query"
                  placeholder="e.g., Avanza, Toyota, cmb..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-11 text-base bg-white border-gray-300 focus-visible:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="date-filter" className="text-xs font-medium text-gray-600">Filter by Date</Label>
              <div className="mt-1">
                <DatePickerWithRange  value={dateFilter} onChange={setDateFilter} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-[135px] md:top-[149px] z-10 bg-gray-50/80 backdrop-blur-sm">
         <FilterTabs
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            statusCounts={statusCounts}
          />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredBookings.length === 0 ? (
          <EmptyState
            selectedStatus={selectedStatus}
            onNewBooking={() => navigate('/rentals')} 
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={() => navigate(`/detail-booking-vehicle/${booking.id}`)}
              />
            ))}
          </div>
        )}
      </main>
      <div className="h-20" />
    </div>
  );
}
