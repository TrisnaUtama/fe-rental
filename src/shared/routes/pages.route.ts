import CreateUserPage from "@/features/admin/protected/user/pages/createPage";
import CreateDestinationForm from "@/features/admin/protected/destinations/pages/createPage";
import CreateVehicleForm from "@/features/admin/protected/vehicle/pages/createPage";
import CreateTravelPackageForm from "@/features/admin/protected/travel-pack/pages/createPage";
import CreateAccomodationForm from "@/features/admin/protected/acccomodation/pages/createPage";
import UpdateDestinationPage from "@/features/admin/protected/destinations/pages/updatePage";
import UpdateUserPage from "@/features/admin/protected/user/pages/updatePage";
import UpdateVehiclePage from "@/features/admin/protected/vehicle/pages/updatePage";
import UpdateTravelPackPage from "@/features/admin/protected/travel-pack/pages/updatePage";
import UpdateAccomodationPage from "@/features/admin/protected/acccomodation/pages/updatePage";
import BookingPageVehicle from "@/features/customer/booking/pages/vehicle/BookingPage";
import BookingSuccess from "@/features/redirect/pages/success_booking";
import ListBookingVehicle from "@/features/customer/booking/pages/vehicle/ListBooking";
import ListBookingTravel from "@/features/customer/booking/pages/travel/ListBooking";
import DetailBookingVehiclePage from "@/features/customer/booking/pages/vehicle/DetailBookingPage";
import DetailBookingTravelPage from "@/features/customer/booking/pages/travel/DetailBookingPage";
import PaymentFinish from "@/features/redirect/pages/finishPayment";
import PaymentError from "@/features/redirect/pages/errorPayment";
import PaymentUnfinish from "@/features/redirect/pages/unfinishPayment";
import BookingPageTravel from "@/features/customer/booking/pages/travel/BookingPage";
import DetailBookingPage from "@/features/admin/protected/booking/pages/detailPage";
import CreatePromoPage from "@/features/admin/protected/promo/pages/createPage";
import UpdatePromoPage from "@/features/admin/protected/promo/pages/updatePage";
import ProfileIndex from "@/features/admin/protected/user/pages/Profile";
import ProfileIndexCustomer from "@/features/customer/profile/pages/profile";

export const pageRoutes = [
  {
    path: "/staff/data-user/create",
    element: CreateUserPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-destination/create",
    element: CreateDestinationForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-vehicle/create",
    element: CreateVehicleForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-promo/create",
    element: CreatePromoPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE"]
  },
  {
    path: "/staff/data-travel-pack/create",
    element: CreateTravelPackageForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-accomodation/create",
    element: CreateAccomodationForm,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-user/update/:id",
    element: UpdateUserPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-destination/update/:id",
    element: UpdateDestinationPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-vehicle/update/:id",
    element: UpdateVehiclePage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-travel-pack/update/:id",
    element: UpdateTravelPackPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/data-accomodation/update/:id",
    element: UpdateAccomodationPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
  },
  {
    path: "/staff/detail-booking/:id",
    element: DetailBookingPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE"]
  },
  {
    path: "/staff/data-promo/update/:id",
    element: UpdatePromoPage,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE"]
  },
  {
    path: "/staff/profile",
    element: ProfileIndex,
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE"]
  },
];

export const customerRoute = [
  {
    path: "/booking-vehicle",
    element: BookingPageVehicle,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/success-submit-booking",
    element: BookingSuccess,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/list-booking-vehicle",
    element: ListBookingVehicle,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/list-booking-travel",
    element: ListBookingTravel,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/detail-booking-vehicle/:id",
    element: DetailBookingVehiclePage,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/detail-booking-travel/:id",
    element: DetailBookingTravelPage,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/payment/finish",
    element: PaymentFinish,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/payment/error",
    element: PaymentError,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/payment/unfinish",
    element: PaymentUnfinish,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/booking-travel-pack",
    element: BookingPageTravel,
    roles: ["CUSTOMER"] ,
  },
  {
    path: "/profile",
    element: ProfileIndexCustomer,
    roles: ["CUSTOMER"] ,
  },
];
