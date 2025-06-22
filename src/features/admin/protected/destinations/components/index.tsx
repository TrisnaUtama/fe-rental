import { useAllDestinations } from "../hooks/useDestinations";
import { DataTable } from "@/shared/components/table/table";
import { destinationColumns } from "./table/column";
import type { IDestination } from "../types/destination.type";
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function Index() {
  const { data, isLoading, isError, error } = useAllDestinations();
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching destination: {String(error)}</div>;
  return (
    <div>
      <DataTable<IDestination>
        data={data?.data ?? []}
        path="/staff/data-destination/create"
        columns={destinationColumns}
        rowIdKey="id"
        addSectionLabel="Add New Destination"
      />
    </div>
  );
}
