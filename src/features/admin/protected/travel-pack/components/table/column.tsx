import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { DragHandle } from "@/shared/components/table/dragHandle";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ActionsCell } from "./actionCell";
import type { ITravelPack } from "../../types/travel-pack";

export const travelPackColumns: ColumnDef<ITravelPack>[] = [
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
    accessorKey: "image",
    header: () => <div className="text-center">Image</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.image ? (
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-16 h-16 rounded-md object-cover border"
          />
        ) : (
          <span className="text-muted-foreground italic">No Image</span>
        )}
      </div>
    ),
  },

  {
    accessorKey: "name",
    header: () => <div className="text-center">Name</div>,
    cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-center">Duration (hours)</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.duration} hours</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">Description</div>,
    cell: ({ row }) => (
      <div className="text-center max-w-xs truncate">{row.original.description}</div>
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
            className={`px-2 ${
              isActive ? "text-black" : "text-white"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "destination_count",
    header: () => <div className="text-center">Destinations</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.travel_package_destinations?.length ?? 0} {row.original.travel_package_destinations?.length > 1 ? "locations" : "location" }
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell travelPack={row.original} />,
  },
];

