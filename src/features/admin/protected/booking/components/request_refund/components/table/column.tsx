import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { BookingResponse } from "../../../../types/booking.type";
import { ActionsCell } from "./actionCell"; 
import { StatusBadge } from "@/features/customer/booking/components/vehicle/list/StatusBadge";
import { format } from "date-fns";
import { Car, Map } from "lucide-react";

// Helper to format currency
const formatRupiah = (value: string | number | null | undefined) => {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

export const bookingColumns: ColumnDef<BookingResponse>[] = [
  // --- Select Checkbox Column ---
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // --- Booking ID Column ---
  {
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-gray-700">
        #{row.original.id.slice(-8)}
      </div>
    ),
  },

  // --- Customer Name Column ---
  {
    accessorKey: "users.name",
    header: "Customer",
    cell: ({ row }) => <div>{row.original.users?.name || "N/A"}</div>,
  },
  
  // --- Booking Details Column (Smart Column) ---
  {
    id: "bookingDetails",
    header: "Booking Details",
    cell: ({ row }) => {
      const booking = row.original;
      if (booking.travel_package) {
        return (
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="font-medium">Travel Package</span>
          </div>
        );
      }
      if (booking.booking_vehicles && booking.booking_vehicles.length > 0) {
        return (
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="font-medium">Vehicle Rental</span>
          </div>
        );
      }
      return <div className="text-gray-500">N/A</div>;
    },
  },

  // --- Date Period Column ---
  {
    id: "period",
    header: "Period",
    cell: ({ row }) => {
      const { start_date, end_date } = row.original;
      return (
        <div>
          <p className="font-medium text-sm">
            {format(new Date(start_date), "dd MMM yyyy")}
          </p>
          <p className="text-xs text-gray-500">
            to {end_date ? format(new Date(end_date), "dd MMM yyyy") : 'N/A'}
          </p>
        </div>
      );
    },
  },

  // --- Total Price Column ---
  {
    accessorKey: "total_price",
    header: () => <div className="text-right">Total Price</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold">
        {formatRupiah(row.original.total_price)}
      </div>
    ),
  },

  // --- Status Column ---
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <StatusBadge status={row.original.status as any} />
      </div>
    ),
  },

  // --- Actions Column ---
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell booking={row.original} />,
  },
];
