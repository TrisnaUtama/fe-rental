import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
// import { DataTable } from "@/components/layout/sidebar/data-table"
import { SiteHeader } from "@/components/layout/sidebar/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


// import data from "../../../../data.json"

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
