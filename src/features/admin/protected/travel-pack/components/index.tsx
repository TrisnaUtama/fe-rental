import { useAllTravelPack } from "../hooks/useTravelPack";
import { DataTable } from "@/shared/components/table/table";
import { travelPackColumns } from "./table/column";
import type { ITravelPack } from "../types/travel-pack";
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function Index() {
  const { data, isLoading, isError, error } = useAllTravelPack(
  );
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching destination: {String(error)}</div>;
  return (
    <div>
      <DataTable<ITravelPack>
        data={data?.data ?? []}
        path="/staff/data-travel-pack/create"
        columns={travelPackColumns}
        rowIdKey="id"
        addSectionLabel="Add New Travel Pack"
      />
    </div>
  );
}
