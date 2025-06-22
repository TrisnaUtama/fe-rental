import { useState, useMemo } from "react";
import { useAllBookingUser } from "../../hooks/useBooking";
import { useAuthContext } from "@/shared/context/authContex";
import {  useNavigate } from "react-router-dom";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { BookingStatus } from "../../types/booking.type";
import { motion, AnimatePresence } from "framer-motion";

import { BookingCardTravel } from "./list/BookingCard";
import { FilterSidebar } from "./list/FilterSidebar";
import { EmptyStateTravel } from "./list/EmptyState";

export default function BookingHistoryTravel() {
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(
    undefined
  );

  const { data: bookingData, isLoading } = useAllBookingUser(
    accessToken! || ""
  );

  const filteredBookings = useMemo(() => {
    if (!bookingData?.data) return [];
    const query = searchQuery.toLowerCase().trim();
    const filtered = bookingData.data.filter((booking) => {
      if (!booking.travel_package_id) return false;
      if (selectedStatus !== "ALL" && booking.status !== selectedStatus)
        return false;
      if (dateFilter?.from && dateFilter?.to) {
        const bookingStart = new Date(booking.start_date);
        const bookingEnd = new Date(booking.end_date!);
        const filterStart = new Date(dateFilter.from);
        filterStart.setHours(0, 0, 0, 0);
        const filterEnd = new Date(dateFilter.to);
        filterEnd.setHours(23, 59, 59, 999);
        if (!(bookingStart <= filterEnd && bookingEnd >= filterStart))
          return false;
      }
      if (query) {
        const hasMatchingText =
          booking.id.toLowerCase().includes(query) ||
          booking.travel_package?.name.toLowerCase().includes(query);
        if (!hasMatchingText) return false;
      }
      return true;
    });
    return filtered ?? [];
  }, [bookingData, selectedStatus, searchQuery, dateFilter]);

  const statusCounts = useMemo(() => {
    if (!bookingData?.data)
      return { ALL: 0 } as Record<BookingStatus | "ALL", number>;
    const travelBookings = bookingData.data.filter((b) => b.travel_package_id);
    const counts = travelBookings.reduce((acc, booking) => {
      const status = booking.status as BookingStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<BookingStatus, number>);
    return { ALL: travelBookings.length, ...counts } as Record<
      BookingStatus | "ALL",
      number
    >;
  }, [bookingData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleClearFilters = () => {
    setSearchQuery("");
    setDateFilter(undefined);
    setSelectedStatus("ALL");
  };

  const isFilterActive =
    searchQuery.trim() !== "" ||
    dateFilter !== undefined ||
    selectedStatus !== "ALL";

  const filterSidebarProps = {
    selectedStatus,
    onStatusChange: setSelectedStatus,
    statusCounts,
    searchQuery,
    onSearchChange: setSearchQuery,
    dateFilter,
    onDateChange: setDateFilter,
    onClearFilters: handleClearFilters,
    isFilterActive,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* --- Desktop Filter Sidebar --- */}
          <aside className="hidden lg:block py-8">
            <div className="sticky top-8 space-y-8">
              {/* The desktop "Back" button, positioned above the filters */}
              <div className="flex justify-start mb-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/travel")}
                  className="group text-sm flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back
                </Button>
              </div>
              <FilterSidebar {...filterSidebarProps} />
            </div>
          </aside>

          {/* --- Main Content Area --- */}
          <main className="py-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                {/* A separate "Back" button just for mobile screens */}
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden h-10 w-10"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  My Travel Bookings
                </h1>
              </div>

              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Bookings</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <FilterSidebar {...filterSidebarProps} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <EmptyStateTravel onNewBooking={() => navigate("/travels")} />
            ) : (
              <motion.div layout className="space-y-4">
                <AnimatePresence>
                  {filteredBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <BookingCardTravel
                        booking={booking}
                        onViewDetails={() =>
                          navigate(`/detail-booking-travel/${booking.id}`)
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            <div className="h-20" />
          </main>
        </div>
      </div>
    </div>
  );
}
