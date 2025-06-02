import {
  LayoutDashboardIcon,
  User2,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
  TreePalmIcon,
  CarFrontIcon,
  Hotel,
  type LucideIcon,
  PlaneIcon,
} from "lucide-react";
import type { Roles } from "@/shared/enum/enum";

// Import your components
import AdminDashboard from "@/features/admin/protected/dashboard/pages/Dashboard";
import UserIndex from "@/features/admin/protected/user/pages/page";
import DestinationIndex from "@/features/admin/protected/destinations/pages/page";
import VehicleIndex from "@/features/admin/protected/vehicle/pages/page";
import TravelPackIndex from "@/features/admin/protected/travel-pack/pages/page";
import AccomodationIndex from "@/features/admin/protected/acccomodation/pages/page";
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
    url: "/staff/dashboard",
    icon: LayoutDashboardIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
    group: "main",
  },
  {
    title: "User",
    url: "/staff/data-user",
    icon: User2,
    component: UserIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Destination",
    url: "/staff/data-destination",
    icon: TreePalmIcon,
    component: DestinationIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Vehicle",
    url: "/staff/data-vehicle",
    icon: CarFrontIcon,
    component: VehicleIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Accomodation",
    url: "/staff/data-accomodation",
    icon: Hotel,
    component: AccomodationIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Travel Pack",
    url: "/staff/data-travel-pack",
    icon: PlaneIcon,
    component: TravelPackIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
    group: "document",
  },
  {
    title: "Settings",
    url: "/staff/settings",
    icon: SettingsIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
    group: "secondary",
  },
  {
    title: "Get Help",
    url: "/staff/help",
    icon: HelpCircleIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
    group: "secondary",
  },
  {
    title: "Search",
    url: "/staff/search",
    icon: SearchIcon,
    component: AdminDashboard,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
    group: "secondary",
  },
];
