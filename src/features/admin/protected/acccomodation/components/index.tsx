import { useAuthContext } from "@/shared/context/authContex";
import { useAllAccomodation } from "../hooks/useAccomodation";
import { DataTable } from "@/shared/components/table/table";
import { accomodationColumns } from "./table/column";
import type { IAccomodation } from "../types/accomodation.type";
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function Index() {
  const { accessToken } = useAuthContext();
  const { data, isLoading, isError, error } = useAllAccomodation(
    accessToken || ""
  );
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching accomodation: {String(error)}</div>;
  return (
    <div>
      <DataTable<IAccomodation>
        data={data?.data ?? []}
        path="/staff/data-accomodation/create"
        columns={accomodationColumns}
        rowIdKey="id"
        addSectionLabel="Add New Accomodation"
      />
    </div>
  );
}
