import CreateUserPage from "@/features/protected/user/pages/createPage";
import CreateDestinationForm from "@/features/protected/destinations/pages/createPage";
import type { Roles } from "../enum/enum";
import UpdateDestinationPage from "@/features/protected/destinations/pages/updatePage";
import UpdateUserPage from "@/features/protected/user/pages/updatePage";

export const pageRoutes = [
  {
    path: "/data-user/create",
    element: CreateUserPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/data-destination/create",
    element: CreateDestinationForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/data-user/update/:id",
    element: UpdateUserPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/data-destination/update/:id",
    element: UpdateDestinationPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
];
