import { useAuthContext } from "@/shared/context/authContex";
import { useAllPromos } from "../hooks/usePromo";
import { DataTable } from "@/shared/components/table/table";
import { promoColumns } from "./table/column";
import type { IPromo } from "../types/promo.type";
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function Index() {
  const { accessToken } = useAuthContext();
  const { data, isLoading, isError, error } = useAllPromos(
    accessToken || ""
  );
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching destination: {String(error)}</div>;
  return (
    <div>
      <DataTable<IPromo>
        data={data?.data ?? []}
        path="/staff/data-promo/create"
        columns={promoColumns}
        rowIdKey="id"
        addSectionLabel="Add New Promo"
      />
    </div>
  );
}
