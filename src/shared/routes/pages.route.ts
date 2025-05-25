import CreateUserPage from "@/features/user/pages/createPage";
import type { Roles } from "../enum/enum";
import UpdateUserForm from "@/features/user/pages/updatePage";

export const pageRoutes = [
  {
    path: "/data-user/create", 
    element: CreateUserPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/data-user/update/:id", 
    element: UpdateUserForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
];
