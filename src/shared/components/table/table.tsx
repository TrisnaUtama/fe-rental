import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  PlusIcon,
  UploadIcon, // <-- 1. IMPORT IKON BARU
} from "lucide-react";
import { Link } from "react-router-dom";
import { DraggableRow } from "@/shared/components/table/dragAbleRow";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/shared/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";

// <-- 2. MODIFIKASI INTERFACE PROPS
interface DataTableProps<T> {
  data: T[];
  path: string;
  columns: any;
  rowIdKey: keyof T;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onDragEnd?: (data: T[]) => void;
  onAddSectionClick?: () => void;
  noDataMessage?: React.ReactNode;
  customizeColumnsLabel?: string;
  addSectionLabel?: string;
  tabs?: { value: string; label: string; content: React.ReactNode }[];
  hideAddButton?: boolean;
  customFilters?: React.ReactNode;
  addManyButton?: boolean;
  onAddManyClick?: () => void; // Prop baru untuk menangani klik
  addManyLabel?: string; // Prop baru untuk label tombol
}

export function DataTable<T extends object>({
  data: initialData,
  columns,
  rowIdKey,
  path,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onDragEnd,
  noDataMessage = "No results.",
  customizeColumnsLabel = "Customize Columns",
  addSectionLabel,
  tabs = [
    {
      value: "outline",
      label: "Outline",
      content: null,
    },
  ],
  hideAddButton = false,
  customFilters,
  // <-- 3. DESTRUCTURE PROPS BARU
  addManyButton = false,
  onAddManyClick,
  addManyLabel = "Add Many",
}: DataTableProps<T>) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [searchTerm, setSearchTerm] = React.useState("");

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map((row) => row[rowIdKey] as unknown as UniqueIdentifier),
    [data, rowIdKey]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => {
      const id = row[rowIdKey];
      return id ? String(id) : `fallback-${Math.random()}`;
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        const newData = arrayMove(data, oldIndex, newIndex);
        if (onDragEnd) onDragEnd(newData);
        return newData;
      });
    }
  }

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      table.setColumnFilters((prev) => {
        const otherFilters = prev.filter((f) => f.id !== "name");
        if (!searchTerm) return otherFilters;
        return [...otherFilters, { id: "name", value: searchTerm }];
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, table]);

  return (
    <Tabs
      defaultValue={tabs[0]?.value}
      className="flex w-full flex-col justify-start gap-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-4">
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs"
          />
          {customFilters}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ColumnsIcon className="h-4 w-4" />
                <span className="hidden lg:inline">
                  {customizeColumnsLabel}
                </span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* --- 4. LOGIKA TOMBOL DIPERBARUI --- */}
          {/* Tombol untuk "Add Single" */}
          {!hideAddButton && addSectionLabel && (
            <Button variant="outline" size="sm" asChild>
              <Link to={path} className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                <span className="hidden lg:inline">{addSectionLabel}</span>
              </Link>
            </Button>
          )}

          {/* Tombol untuk "Add Many" */}
          {addManyButton && (
            <Button variant="default" size="sm" onClick={onAddManyClick} className="flex items-center gap-2">
              <UploadIcon className="h-4 w-4" />
              <span className="hidden lg:inline">{addManyLabel}</span>
            </Button>
          )}
        </div>
      </div>
      {tabs.map(({ value, content }) => (
        <TabsContent
          key={value}
          value={value}
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          {value === tabs[0].value ? (
            data.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                {noDataMessage}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                >
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} colSpan={header.colSpan}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={dataIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {table.getRowModel().rows.map((row) => (
                          <DraggableRow<T>
                            key={row.id ?? `fallback-${row.index}`}
                            row={row}
                            getRowId={(data) => data[rowIdKey] as string}
                          />
                        ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </DndContext>
              </div>
            )
          ) : (
            content
          )}
        </TabsContent>
      ))}
      <div className="flex items-center justify-between px-4">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value: any) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
              <span className="sr-only">First Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRightIcon className="h-4 w-4" />
              <span className="sr-only">Last Page</span>
            </Button>
          </div>
          <div className="hidden flex-1 text-right text-sm text-muted-foreground sm:flex">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>
      </div>
    </Tabs>
  );
}