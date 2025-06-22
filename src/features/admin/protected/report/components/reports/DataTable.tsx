import { AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  error: any;
  tableRef: React.Ref<HTMLTableElement>;
}

export const DataTable = <T extends { id: any }>({
  columns,
  data,
  isLoading,
  error,
  tableRef,
}: DataTableProps<T>) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" ref={tableRef}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${
                    col.className ?? ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-12 text-gray-500"
                >
                  <div className="animate-pulse">Memuat data...</div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-12 text-red-600 font-medium flex items-center justify-center"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Gagal mengambil data.
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        col.cellClassName ?? ""
                      }`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : String((item as any)[col.accessor] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-12 text-gray-500"
                >
                  Tidak ada data yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
