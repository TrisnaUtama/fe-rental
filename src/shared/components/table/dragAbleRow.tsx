// components/draggable-row.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Row, flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/shared/components/ui/table";

interface DraggableRowProps<T> {
  row: Row<T>;
  getRowId: (rowData: T) => string;
}

export function DraggableRow<T>({ row, getRowId }: DraggableRowProps<T>) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: getRowId(row.original),
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
