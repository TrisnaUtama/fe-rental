import { SidebarProvider } from "./sidebar-context";
import { AppSidebar } from "./sidebar";
import {SiteHeader} from "./site-header";
import Footer from "./footer"; // <- import your Footer

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <SiteHeader />

          {/* Page content takes up remaining space */}
          <main className="flex-1 mt-20">{children}</main>

          {/* Footer always at bottom */}
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
