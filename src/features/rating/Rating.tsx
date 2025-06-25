import { Link } from "react-router-dom";
import { useAllDestinations } from "@/features/admin/protected/destinations/hooks/useDestinations";
import { DestinationRatingItem } from "@/features/customer/rating/components/DestinationRatingItem";
// Ganti MapPin dengan ArrowLeft
import { Loader2, AlertTriangle, Info, ArrowLeft } from "lucide-react"; 
import type { IDestination } from "@/features/admin/protected/destinations/types/destination.type";

export function RateDestinationsPage() {
  const { 
    data: destinationsResponse, 
    isLoading, 
    isError, 
    error 
  } = useAllDestinations();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-lg font-medium">Loading Destinations...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600 bg-red-50 p-6 rounded-lg">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-lg font-bold">Failed to Load Data</p>
        <p className="text-sm">
          {error instanceof Error ? error.message : "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  const destinations = destinationsResponse?.data ?? [];
  if (destinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600 bg-gray-50 p-6 rounded-lg">
        <Info className="w-8 h-8 mb-4" />
        <p className="text-lg font-bold">No Destinations Found</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Rate Your Visited Destinations
          </h1>
          <p className="mt-2 text-md text-gray-600 max-w-2xl mx-auto">
            Your feedback is valuable! Help other travelers by sharing your experience.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {destinations.map((destination: IDestination) => (
              <DestinationRatingItem 
                key={destination.id} 
                destination={destination} 
              />
            ))}
          </div>
        </main>
      </div>

      {/* === TOMBOL STICKY YANG DIPERBARUI (TEKS + IKON) === */}
      <Link
        to="/destination"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-gray-800 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
        aria-label="Kembali ke halaman rekomendasi destinasi"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Show Rekomendasi</span>
      </Link>
    </>
  );
}