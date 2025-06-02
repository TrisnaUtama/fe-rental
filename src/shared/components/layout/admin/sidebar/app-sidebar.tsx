import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

import { NavDocuments } from "@/shared/components/layout/admin/sidebar/nav-documents";
import { NavMain } from "@/shared/components/layout/admin/sidebar/nav-main";
import { NavSecondary } from "@/shared/components/layout/admin/sidebar/nav-secondary";
import { NavUser } from "@/shared/components/layout/admin/sidebar/nav-user";
import { routeConfigs } from "@/shared/routes/sidebar.route";

import { ArrowUpCircleIcon } from "lucide-react";
import { useAuthContext } from "@/shared/context/authContex";
import { useLocation } from "react-router-dom";
import type { Roles } from "@/shared/enum/enum";
import { Link } from "react-router-dom";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext();
  const location = useLocation();
  if (!user) return null;

  const userRole = user.role as Roles;

  const filterByRole = (group: "main" | "secondary" | "document") =>
    routeConfigs.filter(
      (route) => route.group === group && route.roles.includes(userRole)
    );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filterByRole("main")} activePath={location.pathname} />
        <NavDocuments
          items={filterByRole("document")}
          activePath={location.pathname}
        />
        <NavSecondary items={filterByRole("secondary")} className="mt-auto" />
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
