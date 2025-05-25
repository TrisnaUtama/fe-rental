import SidebarLayout from "@/components/layout/sidebar/sidebar-layout";
import AdminOverview from "../components/DashboardOverview";

export default function AdminDashboard() {
  return (
    <SidebarLayout>
      <AdminOverview />
    </SidebarLayout>
  );
}