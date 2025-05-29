import { type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, LoaderIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { DragHandle } from "@/shared/components/table/dragHandle";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { IUser } from "../../types/user.type";
import { ActionsCell } from "./actionCell";

export const userColumns: ColumnDef<IUser>[] = [
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
    accessorKey: "name",
    header: () => <div className="text-center">Name</div>,
    cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => <div className="text-center">{row.original.email}</div>,
  },
  {
    accessorKey: "phone_number",
    header: () => <div className="text-center">Phone</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.phone_number}</div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-2 text-muted-foreground">
          {row.original.role}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "is_verified",
    header: () => <div className="text-center">Verified</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.is_verified ? (
          <CheckCircle2Icon className="text-green-500 size-4" />
        ) : (
          <LoaderIcon className="text-yellow-500 size-4" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant={row.original.status ? "secondary":"destructive"} className={`px-2 text-muted-foreground ${!row.original.status && "text-white"}`}>
          {row.original.status ? "Active" : "Deactive"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "year_of_experiences",
    header: () => <div className="text-center">Experience</div>,
    cell: ({ row }) => {
      const { role, year_of_experiences } = row.original;
      if (role !== "DRIVER") {
        return (
          <div
            className="text-center text-muted-foreground"
            aria-label="No experience data"
          >
            Not Provided
          </div>
        );
      } else {
        return <div className="text-center">{year_of_experiences} yr</div>;
      }
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];
