import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { DragHandle } from "@/shared/components/table/dragHandle";
import { ActionsCell } from "./actionCell";
import type { IAccomodation } from "../../types/accomodation.type";

export const accomodationColumns: ColumnDef<IAccomodation>[] = [
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
      <div className="flex justify-center items-center">
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
      <div className="flex justify-center items-center">
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
    accessorKey: "image_urls",
    header: () => <div className="text-center">Image</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.original.image_urls[0]}
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
    accessorKey: "price_per_night",
    header: () => <div className="text-center">Price / Night</div>,
    cell: ({ row }) => (
      <div className="text-center">
        Rp{row.original.price_per_night.toLocaleString("id-ID")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center">Address</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.address}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant={row.original.status ? "secondary" : "destructive"}
          className={`px-2 text-muted-foreground ${
            !row.original.status && "text-white"
          }`}
        >
          {row.original.status ? "Active" : "Inactive"}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell destination={row.original} />,
  },
];
