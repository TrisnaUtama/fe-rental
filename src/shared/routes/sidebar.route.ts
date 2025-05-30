import {
  LayoutDashboardIcon,
  User2,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
  TreePalmIcon,
  CarFrontIcon,
  type LucideIcon,
  PlaneIcon,
} from "lucide-react";
import type { Roles } from "@/shared/enum/enum";

// Import your components
import AdminDashboard from "@/features/protected/dashboard/pages/Dashboard";
import UserIndex from "@/features/protected/user/pages/page";
import DestinationIndex from "@/features/protected/destinations/pages/page"
import VehicleIndex from "@/features/protected/vehicle/pages/page"
import TravelPackIndex from "@/features/protected/travel-pack/pages/page";
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
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Destination",
    url: "/data-destination",
    icon: TreePalmIcon,
    component: DestinationIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Vehicle",
    url: "/data-vehicle",
    icon: CarFrontIcon,
    component: VehicleIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Travel Pack",
    url: "/data-travel-pack",
    icon: PlaneIcon,
    component: TravelPackIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
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
