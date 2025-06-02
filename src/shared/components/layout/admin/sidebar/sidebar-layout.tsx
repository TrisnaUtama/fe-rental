import { AppSidebar } from "@/shared/components/layout/admin/sidebar/app-sidebar";
import { SiteHeader } from "@/shared/components/layout/admin/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function SidebarLayout() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
