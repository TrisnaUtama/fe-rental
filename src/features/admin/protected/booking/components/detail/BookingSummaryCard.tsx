import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Info,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Tag,
  ClipboardList,
} from "lucide-react";
import type { BookingResponse } from "../../types/booking.type";
import React from "react";

const formatRupiah = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return "N/A";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "N/A";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numValue);
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const SpecItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <div className="text-xs text-gray-500 flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
    <div className="text-sm font-semibold text-gray-800">{value}</div>
  </div>
);

export const BookingSummaryCard = ({
  booking,
}: {
  booking: BookingResponse;
}) => (
  <Card className="rounded-2xl shadow-sm">
    <CardHeader>
      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Info className="w-6 h-6 text-blue-500" />
        Booking Summary
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
      <SpecItem
        icon={Calendar}
        label="Booking Date (Start)"
        value={formatDate(booking.start_date)}
      />
      <SpecItem
        icon={Calendar}
        label="Booking Date (End)"
        value={formatDate(booking.end_date)}
      />
      <SpecItem
        icon={Clock}
        label="Created At"
        value={formatDate(booking.created_at)}
      />
      <SpecItem
        icon={Clock}
        label="Last Updated"
        value={formatDate(booking.updated_at)}
      />
      <SpecItem
        icon={MapPin}
        label="Pick Up at Airport"
        value={booking.pick_up_at_airport ? "Yes" : "No"}
      />
      <SpecItem
        icon={DollarSign}
        label="Total Price"
        value={formatRupiah(booking.total_price)}
      />
      {booking.notes && (
        <SpecItem
          icon={ClipboardList}
          label="Customer Notes"
          value={booking.notes}
        />
      )}
      {booking.promos && (
        <>
          <SpecItem icon={Tag} label="Promo Code" value={booking.promos.code} />
          <SpecItem
            icon={Tag}
            label="Discount Applied"
            value={`${booking.promos.discount_value}%`}
          />
        </>
      )}
    </CardContent>
  </Card>
);
