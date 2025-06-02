import { useAuthContext } from "@/shared/context/authContex";
import { useAllVehicle } from "../hooks/useVehicle";
import { DataTable } from "@/shared/components/table/table";
import { vehicleColumns } from "./table/column";
import type { IVehicle } from "../types/vehicle.type";
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function Index() {
  const { accessToken } = useAuthContext();
  const { data, isLoading, isError, error } = useAllVehicle(
    accessToken || ""
  );
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching destination: {String(error)}</div>;
  return (
    <div>
      <DataTable<IVehicle>
        data={data?.data ?? []}
        path="/staff/data-vehicle/create"
        columns={vehicleColumns}
        rowIdKey="id"
        addSectionLabel="Add New Vehicle"
      />
    </div>
  );
}
