import CreateUserPage from "@/features/admin/protected/user/pages/createPage";
import CreateDestinationForm from "@/features/admin/protected/destinations/pages/createPage";
import CreateVehicleForm from "@/features/admin/protected/vehicle/pages/createPage";
import CreateTravelPackageForm from "@/features/admin/protected/travel-pack/pages/createPage";
import CreateAccomodationForm from "@/features/admin/protected/acccomodation/pages/createPage";
import type { Roles } from "../enum/enum";
import UpdateDestinationPage from "@/features/admin/protected/destinations/pages/updatePage";
import UpdateUserPage from "@/features/admin/protected/user/pages/updatePage";
import UpdateVehiclePage from "@/features/admin/protected/vehicle/pages/updatePage";
import UpdateTravelPackPage from "@/features/admin/protected/travel-pack/pages/updatePage";
import UpdateAccomodationPage from "@/features/admin/protected/acccomodation/pages/updatePage";

export const pageRoutes = [
  {
    path: "/staff/data-user/create",
    element: CreateUserPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-destination/create",
    element: CreateDestinationForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-vehicle/create",
    element: CreateVehicleForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-travel-pack/create",
    element: CreateTravelPackageForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-accomodation/create",
    element: CreateAccomodationForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-user/update/:id",
    element: UpdateUserPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-destination/update/:id",
    element: UpdateDestinationPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-vehicle/update/:id",
    element: UpdateVehiclePage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-travel-pack/update/:id",
    element: UpdateTravelPackPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
  {
    path: "/staff/data-accomodation/update/:id",
    element: UpdateAccomodationPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"] as Roles[],
  },
];
