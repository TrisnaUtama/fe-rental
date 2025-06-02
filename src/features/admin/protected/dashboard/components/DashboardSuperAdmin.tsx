import { ChartAreaInteractive } from "@/shared/components/layout/admin/sidebar/chart-area-interactive";
import { SectionCards } from "@/shared/components/layout/admin/sidebar/section-card";

export default function DashboardSuperAdmin() {
  return (
    <div className="space-y-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
