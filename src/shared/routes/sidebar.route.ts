import {
  LayoutDashboardIcon,
  User2,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
  type LucideIcon,
} from "lucide-react";
import type { Roles } from "@/shared/enum/enum";

// Import your components
import AdminDashboard from "@/features/dashboard/pages/Dashboard";
import UserIndex from "@/features/user/pages/page";
// import DataLibraryPage from "@/pages/data-library";
// import UserDataPage from "@/pages/data-user";
// import SettingsPage from "@/pages/settings";
// import HelpPage from "@/pages/help";
// import SearchPage from "@/pages/search";

export interface RouteConfig {
  title: string;
  url: string;
  icon: LucideIcon;
  component: React.ComponentType<any>;
  roles: Roles[];
  group: "main" | "secondary" | "document";
}

export const routeConfigs: RouteConfig[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
    group: "main",
  },
  {
    title: "User",
    url: "/data-user",
    icon: User2,
    component: UserIndex,
    roles: ["SUPERADMIN","ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN","ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
    group: "secondary",
  },
  {
    title: "Get Help",
    url: "/help",
    icon: HelpCircleIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
    group: "secondary",
  },
  {
    title: "Search",
    url: "/search",
    icon: SearchIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
    group: "secondary",
  },
];
