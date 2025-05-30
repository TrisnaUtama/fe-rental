import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { DragHandle } from "@/shared/components/table/dragHandle";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { IVehicle } from "../../types/vehicle.type";
import { ActionsCell } from "./actionCell";

export const vehicleColumns: ColumnDef<IVehicle>[] = [
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
    accessorKey: "image_url",
    header: () => <div className="text-center">Image</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.original.image_url?.[0] || "/placeholder.jpg"}
          alt={row.original.name}
          className="h-12 w-12 object-cover rounded-full"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Name</div>,
    cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
  },
  {
    accessorKey: "brand",
    header: () => <div className="text-center">Brand</div>,
    cell: ({ row }) => <div className="text-center">{row.original.brand}</div>,
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.original.type}</div>
    ),
  },
  {
    accessorKey: "transmition",
    header: () => <div className="text-center">Transmission</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.transmition}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant={
            row.original.status === "AVAILABLE"
              ? "secondary"
              : row.original.status === "RENTED"
              ? "default"
              : "destructive"
          }
        >
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "price_per_day",
    header: () => <div className="text-center">Price/Day</div>,
    cell: ({ row }) => (
      <div className="text-center">
        Rp {parseFloat(row.original.price_per_day).toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell vehicle={row.original} />,
  },
];
