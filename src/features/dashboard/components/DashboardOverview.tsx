import { ChartAreaInteractive } from "@/components/layout/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/layout/sidebar/section-card";

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
