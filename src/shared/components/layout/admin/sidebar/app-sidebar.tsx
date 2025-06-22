import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/components/ui/sidebar";
import { NavDocuments } from "@/shared/components/layout/admin/sidebar/nav-documents";
import { NavMain } from "@/shared/components/layout/admin/sidebar/nav-main";
import { NavSecondary } from "@/shared/components/layout/admin/sidebar/nav-secondary";
import { NavUser } from "@/shared/components/layout/admin/sidebar/nav-user";
import { routeConfigs, getRoutesByRole, type RouteConfig } from "@/shared/routes/sidebar.route"; 
import { ArrowUpCircleIcon } from "lucide-react";
import { useAuthContext } from "@/shared/context/authContex";
import type { Roles } from "@/shared/enum/enum";
import { Link } from "react-router-dom";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();
  if (!user) return null;
  const userRole = user.role as Roles;

  const accessibleRoutes = React.useMemo(() => {
    return getRoutesByRole(routeConfigs, userRole);
  }, [userRole]);

  const navMainItems: RouteConfig[] = React.useMemo(() => {
    return accessibleRoutes.filter((route) => route.group === "main");
  }, [accessibleRoutes]);

  const navDocumentsItems: RouteConfig[] = React.useMemo(() => {
    return accessibleRoutes.filter((route) => route.group === "document");
  }, [accessibleRoutes]);

  const navSecondaryItems: RouteConfig[] = React.useMemo(() => {
    return accessibleRoutes.filter((route) => route.group === "secondary");
  }, [accessibleRoutes]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/staff/dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">BBT</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMainItems} activePath={""} />
        <NavDocuments items={navDocumentsItems} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: "/avatars/shadcn.jpg", 
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
