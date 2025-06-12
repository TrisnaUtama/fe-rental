"use client"

import { Button } from "@/shared/components/ui/button"
import { Calendar, Plus } from "lucide-react"

interface EmptyStateProps {
  selectedStatus: string
  onNewBooking: () => void
}

export function EmptyState({ selectedStatus, onNewBooking }: EmptyStateProps) {
  const isFiltered = selectedStatus !== "ALL"

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-blue-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {isFiltered ? "No bookings found" : "No bookings yet"}
      </h3>

      <p className="text-gray-500 text-center mb-6 max-w-sm">
        {isFiltered
          ? `You don't have any ${selectedStatus.toLowerCase()} bookings at the moment.`
          : "Start your journey by booking your first vehicle with us."}
      </p>

      {!isFiltered && (
        <Button onClick={onNewBooking} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Book Your First Vehicle
        </Button>
      )}
    </div>
  )
}
