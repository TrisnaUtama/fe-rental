import { BusinessSummaryChart } from "@/shared/components/layout/admin/sidebar/chart-area-interactive";
import { BusinessSummaryCards } from "@/shared/components/layout/admin/sidebar/bussines-card";

export default function DashboardSuperAdmin() {
  return (
    <div className="space-y-6">
      <BusinessSummaryCards />
      <div className="px-4 lg:px-6">
        <BusinessSummaryChart />
      </div>
    </div>
  );
}
