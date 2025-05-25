import { useAuthContext } from "@/shared/context/authContex";
import DashboardSuperAdmin from "../components/DashboardSuperAdmin";
import DashboardOperational from "../components/DashboardOperational";
import DashboardFinance from "../components/DashboardFinance";
import DashboardDriver from "../components/DashboardDriver";
import UnauthorizedPage from "@/features/redirect/pages/Unauthorized";

export default function AdminDashboard() {
  const { user } = useAuthContext();

  switch (user?.role) {
    case "SUPERADMIN":
      return <DashboardSuperAdmin />;
    case "ADMIN_OPERATIONAL":
      return <DashboardOperational />;
    case "ADMIN_FINANCE":
      return <DashboardFinance />;
    case "DRIVER":
      return <DashboardDriver />;
    default:
      return <UnauthorizedPage />;
  }
}
