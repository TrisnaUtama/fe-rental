import {
  LayoutDashboardIcon,
  User2,
  TreePalmIcon,
  CarFrontIcon,
  Hotel,
  type LucideIcon,
  PlaneIcon,
  BookCopy,
  PercentIcon,
  FileArchive
} from "lucide-react";
import type { Roles } from "@/shared/enum/enum"; 

import AdminDashboard from "@/features/admin/protected/dashboard/pages/Dashboard";
import UserIndex from "@/features/admin/protected/user/pages/page";
import DestinationIndex from "@/features/admin/protected/destinations/pages/page";
import VehicleIndex from "@/features/admin/protected/vehicle/pages/page";
import TravelPackIndex from "@/features/admin/protected/travel-pack/pages/page";
import PromoIndex from "@/features/admin/protected/promo/pages/page";
import AccomodationIndex from "@/features/admin/protected/acccomodation/pages/page";
import BookingIndex from "@/features/admin/protected/booking/pages/page"; 
import AwaitingBookingIndex from "@/features/admin/protected/booking/pages/AwaitingReviewPage";
import RescheduleBookingIndex from "@/features/admin/protected/booking/pages/RequestReschedulePage";
import ResfundBookingIndex from "@/features/admin/protected/booking/pages/RequestRefundPage";
import CompleteBookingIndex from "@/features/admin/protected/booking/pages/CompleteBooking";
import PaymentReport from "@/features/admin/protected/report/pages/paymentPage";
import RefundReport from "@/features/admin/protected/report/pages/refundPage";
import RescheduleRequest from "@/features/admin/protected/report/pages/reschedulePage";
import FinancialSummaryReport from "@/features/admin/protected/report/pages/financialSummary";
import VehicleUtilization from "@/features/admin/protected/report/pages/vehicleUtilizatioin";
import TravelReport from "@/features/admin/protected/report/pages/travelReport";
import UserReportSummary from "@/features/admin/protected/report/pages/userReportSumarry";
import OverallBusinessSummaryReport from "@/features/admin/protected/report/pages/bussinesSumarry"; // Assuming this is your page component for overall business summary


// Interfaces for route configuration
export interface SubRoute {
  title: string;
  url: string;
  component: React.ComponentType<any>;
  roles: Roles[];
}

export interface RouteConfig {
  title: string;
  url: string;
  icon: LucideIcon;
  component?: React.ComponentType<any>; 
  subItems?: SubRoute[]; 
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
    title: "Promo",
    url: "/staff/data-promo",
    icon: PercentIcon,
    component: PromoIndex,
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
    title: "Bookings",
    url: "/staff/bookings",
    icon: BookCopy,
    group: "document",
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE"],
    subItems: [
      {
        title: "All Bookings",
        url: "/staff/bookings/all",
        roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE"],
        component: BookingIndex,
      },
      {
        title: "Awaiting Review",
        url: "/staff/bookings/review",
        roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
        component: AwaitingBookingIndex,
      },
      {
        title: "Refund Requests",
        url: "/staff/bookings/refunds",
        roles: ["SUPERADMIN", "ADMIN_FINANCE"],
        component: ResfundBookingIndex,
      },
      {
        title: "Reschedule Requests",
        url: "/staff/bookings/reschedules",
        roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
        component: RescheduleBookingIndex,
      },
      {
        title: "Complete Booking",
        url: "/staff/bookings/to-complete",
        roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
        component: CompleteBookingIndex,
      },
    ],
  },
  {
    title: "Reports",
    url: "/staff/reports",
    icon: FileArchive,
    group: "document",
    roles: ["SUPERADMIN", "ADMIN_OPERATIONAL", "ADMIN_FINANCE"],
    subItems: [
      {
        title: "Overall Business Summary", 
        url: "/staff/reports/overall-business-summary",
        roles: ["SUPERADMIN"], 
        component: OverallBusinessSummaryReport,
      },
      {
        title: "Financial Summary",
        url: "/staff/reports/financial-summary",
        roles: ["SUPERADMIN", "ADMIN_FINANCE"],
        component: FinancialSummaryReport,
      },
      {
        title: "Payments Report",
        url: "/staff/reports/payment-report",
        roles: ["SUPERADMIN", "ADMIN_FINANCE"], 
        component: PaymentReport,
      },
      {
        title: "Refunds Report",
        url: "/staff/reports/refund-report",
        roles: ["SUPERADMIN", "ADMIN_FINANCE"], 
        component: RefundReport,
      },
      {
        title: "Reschedule Report",
        url: "/staff/reports/reschedule-report",
        roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
        component: RescheduleRequest,
      },
      {
        title: "Vehicle Utilization Report", 
        url: "/staff/reports/vehicle-utilization",
        roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
        component: VehicleUtilization,
      },
      {
        title: "Travel Package Popularity Report", 
        url: "/staff/reports/travel-package-popularity",
        roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"],
        component: TravelReport, 
      },
      {
        title: "Users Report",
        url: "/staff/reports/users-and-drivers",
        roles: ["SUPERADMIN", "ADMIN_OPERATIONAL"], 
        component: UserReportSummary,
      },
    ],
  },
];


export const getRoutesByRole = (allRoutes: RouteConfig[], role: Roles): RouteConfig[] => {
  return allRoutes.flatMap(route => { 
    const isMainRouteAccessible = route.roles.includes(role);

    if (isMainRouteAccessible) {
      if (route.subItems && route.subItems.length > 0) {
        const accessibleSubItems = route.subItems.filter(subItem =>
          subItem.roles.includes(role)
        );
        if (accessibleSubItems.length === 0) {
          return []; 
        }

        return [{
          ...route,
          subItems: accessibleSubItems,
        }];
      }
      return [route];
    }
    return []; 
  });
};