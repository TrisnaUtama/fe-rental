import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavDocuments } from "@/components/layout/sidebar/nav-documents";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavSecondary } from "@/components/layout/sidebar/nav-secondary";
import { NavUser } from "@/components/layout/sidebar/nav-user";

import {
  navMainRoutes,
  navSecondaryRoutes,
  documentRoutes,
} from "@/shared/routes/route";

import { ArrowUpCircleIcon } from "lucide-react";
import { useAuthContext } from "@/shared/context/authContex";
import { useLocation } from "react-router-dom";
import type { Roles } from "@/shared/enum/enum";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();
  const location = useLocation();
  if (!user) return null;
  const userRole = user.role as Roles;

  const filterRoutesByRole = (routes: typeof navMainRoutes, userRole: Roles) =>
    routes.filter((route) => route.roles.includes(userRole));
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={filterRoutesByRole(navMainRoutes, userRole)}
          activePath={location.pathname}
        />
        <NavDocuments
          items={filterRoutesByRole(documentRoutes, userRole)}
          activePath={location.pathname}
        />
        <NavSecondary
          items={filterRoutesByRole(navSecondaryRoutes, userRole)}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <NavUser
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: "/avatars/shadcn.jpg",
            }}
          />
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            Not logged in
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
