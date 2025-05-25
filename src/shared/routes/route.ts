import {
  LayoutDashboardIcon,
  User2,
  Star,
  DatabaseIcon,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
  type LucideIcon,
} from "lucide-react";

import { type Roles } from "@/shared/enum/enum";

export const navMainRoutes: Array<{
  title: string;
  url: string;
  icon: LucideIcon;
  roles: Roles[];
}> = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboardIcon,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
  },
  {
    title: "User",
    url: "/user",
    icon: User2,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    title: "Rating",
    url: "/rating",
    icon: Star,
    roles: ["SUPERADMIN"],
  },
];

export const navSecondaryRoutes: Array<{
  title: string;
  url: string;
  icon: LucideIcon;
  roles: Roles[];
}> = [
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
    roles: ["SUPERADMIN"],
  },
  {
    title: "Get Help",
    url: "/help",
    icon: HelpCircleIcon,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE", "DRIVER"],
  },
  {
    title: "Search",
    url: "/search",
    icon: SearchIcon,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE"],
  },
];

export const documentRoutes: Array<{
  title: string;
  url: string;
  icon: LucideIcon;
  roles: Roles[];
}> = [
  {
    title: "Data Library",
    url: "/data-library",
    icon: DatabaseIcon,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
];
