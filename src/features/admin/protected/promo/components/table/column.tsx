import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { DragHandle } from "@/shared/components/table/dragHandle";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ActionsCell } from "./actionCell";
import type { IPromo } from "../../types/promo.type";

export const promoColumns: ColumnDef<IPromo>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DragHandle id={row.original.id ?? `fallback-${row.index}`} />
      </div>
    ),
  },
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

  {
    accessorKey: "code",
    header: () => <div className="text-center">Code</div>,
    cell: ({ row }) => <div className="text-center font-medium">{row.original.code}</div>,
  },

  {
    accessorKey: "description",
    header: () => <div className="text-center">Description</div>,
    cell: ({ row }) => (
      <div className="text-center max-w-sm truncate">
        {row.original.description}
      </div>
    ),
  },

  {
    accessorKey: "discount_value",
    header: () => <div className="text-center">Discount (%)</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.discount_value}%</div>
    ),
  },

  {
    accessorKey: "min_booking_amount",
    header: () => <div className="text-center">Min. Booking</div>,
    cell: ({ row }) => (
      <div className="text-center">
        Rp {Number(row.original.min_booking_amount).toLocaleString("id-ID")}
      </div>
    ),
  },

  {
    accessorKey: "start_date",
    header: () => <div className="text-center">Start</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {new Date(row.original.start_date).toLocaleDateString("id-ID")}
      </div>
    ),
  },

  {
    accessorKey: "end_date",
    header: () => <div className="text-center">End</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {new Date(row.original.end_date).toLocaleDateString("id-ID")}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const isActive = row.original.status;
      return (
        <div className="flex justify-center">
          <Badge
            variant={isActive ? "secondary" : "destructive"}
            className={`px-2 ${isActive ? "text-black" : "text-white"}`}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell promo={row.original} />,
  },
];
