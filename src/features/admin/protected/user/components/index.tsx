import { useAuthContext } from "@/shared/context/authContex";
import { useAllUsers } from "../hooks/useUser";
import { DataTable } from "@/shared/components/table/table";
import { userColumns } from "./table/column";
import type { IUser } from "../types/user.type";
import LoadingSpinner from "@/features/redirect/pages/Loading";

export default function Index() {
  const { accessToken } = useAuthContext();
  const { data, isLoading, isError, error } = useAllUsers(accessToken || "");
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching users: {String(error)}</div>;
  return (
    <div>
      <DataTable<IUser>
        data={data?.data ?? []}
        path="/staff/data-user/create"
        columns={userColumns}
        rowIdKey="id"
        addSectionLabel="Add New User"
      />
    </div>
  );
}
