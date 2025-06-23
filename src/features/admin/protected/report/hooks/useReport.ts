import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ReportsService } from "../services/report.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";
import type {
  Booking_Status,
  Payment_Status,
  Refund_Status,
  RescheduleStatus,
  Roles,
  RatedEntityType,
  IOverallBusinessSummary,
  IFinancialSummary,
  IRatingReportItem,
  IAverageRatingsPerEntity,
  IBookingReportItem,
  IRescheduleRequestReportItem,
  IVehicleUtilizationReport,
  IUserReportItem,
  IPaymentReportItem,
  IRefundReportItem,
  IPromoUsageReport,
  ITravelPackagePopularityReport,
  IDailyBusinessSummaryItem,
  IMonthlyFinancialSummaryItem,
} from "../types/report";

/**
 * Hook to fetch the overall business summary.
 * @param startDate - The start date for the report.
 * @param endDate - The end date for the report.
 * @returns A UseQueryResult for the overall business summary.
 */
export function useOverallBusinessSummary(
  startDate: Date,
  endDate: Date
): UseQueryResult<IResponseGlobal<IOverallBusinessSummary>> {
  return useQuery({
    queryKey: [
      "reports",
      "overallBusinessSummary",
      startDate.toISOString(),
      endDate.toISOString(),
    ],
    queryFn: () => ReportsService.getOverallBusinessSummary(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

/**
 * Hook to fetch the financial summary.
 * @param startDate - The start date for the report.
 * @param endDate - The end date for the report.
 * @returns A UseQueryResult for the financial summary.
 */
export function useFinancialSummary(filters: {
  startDate?: Date;
  endDate?: Date;
}): UseQueryResult<IResponseGlobal<IFinancialSummary>> {
  const { startDate, endDate } = filters;
  return useQuery({
    queryKey: [
      "reports",
      "financialSummary",
      startDate!.toISOString(),
      endDate!.toISOString(),
    ],
    queryFn: () => ReportsService.getFinancialSummary(startDate!, endDate!),
    enabled: !!startDate && !!endDate,
  });
}


export function useMonthlyFinancialSummary(
  year?: number | string
): UseQueryResult<IResponseGlobal<IMonthlyFinancialSummaryItem[]>> {
  return useQuery({
    queryKey: ["reports", "monthlyFinancialSummary", year],
    queryFn: () => ReportsService.getMonthlyFinancialSummary(year!),
    enabled: !!year, 
  });
}

/**
 * Hook to fetch a report of all ratings.
 * @param ratedType - Optional: Filter ratings by entity type.
 * @returns A UseQueryResult for the ratings report.
 */
export function useRatingsReport(
  ratedType?: RatedEntityType
): UseQueryResult<IResponseGlobal<IRatingReportItem[]>> {
  return useQuery({
    queryKey: ["reports", "ratings", ratedType],
    queryFn: () => ReportsService.getRatingsReport(ratedType),
  });
}

/**
 * Hook to fetch the average ratings per entity type.
 * @returns A UseQueryResult for the average ratings per entity.
 */
export function useAverageRatingsPerEntity(): UseQueryResult<
  IResponseGlobal<IAverageRatingsPerEntity>
> {
  return useQuery({
    queryKey: ["reports", "averageRatings"],
    queryFn: () => ReportsService.getAverageRatingsPerEntity(),
  });
}

/**
 * Hook to fetch operational booking status report.
 * @param status - The booking status to filter by.
 * @param startDate - Optional: Start date for filtering bookings.
 * @param endDate - Optional: End date for filtering bookings.
 * @returns A UseQueryResult for the operational booking status report.
 */
export function useOperationalBookingStatus(filters: {
  status?: Booking_Status;
  startDate?: Date;
  endDate?: Date;
}): UseQueryResult<IResponseGlobal<IBookingReportItem[]>> {
  const { status, startDate, endDate } = filters;
  return useQuery({
    queryKey: [
      "reports",
      "bookingStatus",
      status,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () =>
      ReportsService.getOperationalBookingStatus(status, startDate, endDate),
  });
}

/**
 * Hook to fetch reschedule requests report.
 * @param status - Optional: Reschedule status to filter by.
 * @param startDate - Optional: Start date for filtering requests.
 * @param endDate - Optional: End date for filtering requests.
 * @returns A UseQueryResult for the reschedule requests report.
 */
export function useRescheduleRequestsReport(filters: {
  status?: RescheduleStatus;
  startDate?: Date;
  endDate?: Date;
}): UseQueryResult<IResponseGlobal<IRescheduleRequestReportItem[]>> {
  const { status, startDate, endDate } = filters;
  return useQuery({
    queryKey: [
      "reports",
      "rescheduleRequests",
      status,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () =>
      ReportsService.getRescheduleRequestsReport(status, startDate, endDate),
  });
}

/**
 * Hook to fetch vehicle utilization report.
 * @param startDate - The start date for the report.
 * @param endDate - The end date for the report.
 * @returns A UseQueryResult for the vehicle utilization report.
 */
export function useVehicleUtilizationReport(
  startDate: Date,
  endDate: Date
): UseQueryResult<IResponseGlobal<IVehicleUtilizationReport>> {
  return useQuery({
    queryKey: [
      "reports",
      "vehicleUtilization",
      startDate.toISOString(),
      endDate.toISOString(),
    ],
    queryFn: () =>
      ReportsService.getVehicleUtilizationReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}

export function useTravelPackagePopularityReport(
  startDate: Date,
  endDate: Date
): UseQueryResult<IResponseGlobal<ITravelPackagePopularityReport>> {
  return useQuery({
    queryKey: [
      "reports",
      "travelPackagePopularity",
      startDate.toISOString(), 
      endDate.toISOString(),
    ],
    queryFn: () => ReportsService.getTravelPackagePopularityReport(startDate, endDate),
    enabled: !!startDate && !!endDate && !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()),
  });
}

export function useDailyBusinessSummary(
  startDate: Date,
  endDate: Date
): UseQueryResult<IResponseGlobal<IDailyBusinessSummaryItem[]>> {
  return useQuery({
    queryKey: [
      "reports",
      "dailyBusinessSummary",
      startDate.toISOString(),
      endDate.toISOString(),
    ],
    queryFn: () => ReportsService.getDailyBusinessSummary(startDate, endDate),
    enabled: !!startDate && !!endDate && !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()), 
  });
}

/**
 * Hook to fetch users and drivers report.
 * @param role - Optional: User role to filter by.
 * @returns A UseQueryResult for the users and drivers report.
 */
export function useUsersAndDriversReport(
  role?: Roles
): UseQueryResult<IResponseGlobal<IUserReportItem[]>> {
  return useQuery({
    queryKey: ["reports", "usersAndDrivers", role],
    queryFn: () => ReportsService.getUsersAndDriversReport(role),
  });
}

/**
 * Hook to fetch payment transactions report.
 * @param status - Optional: Payment status to filter by.
 * @param startDate - Optional: Start date for filtering payments.
 * @param endDate - Optional: End date for filtering payments.
 * @returns A UseQueryResult for the payment transactions report.
 */
export function usePaymentTransactionsReport(filters: {
  status?: Payment_Status;
  startDate?: Date;
  endDate?: Date;
}): UseQueryResult<IResponseGlobal<IPaymentReportItem[]>> {
  const { status, startDate, endDate } = filters;
  return useQuery({
    queryKey: [
      "reports",
      "paymentTransactions",
      status,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () =>
      ReportsService.getPaymentTransactionsReport(status, startDate, endDate),
  });
}

/**
 * Hook to fetch refund requests report.
 * @param status - Optional: Refund status to filter by.
 * @param startDate - Optional: Start date for filtering refunds.
 * @param endDate - Optional: End date for filtering refunds.
 * @returns A UseQueryResult for the refund requests report.
 */
export function useRefundRequestsReport(filters: {
  status?: Refund_Status;
  startDate?: Date;
  endDate?: Date;
}): UseQueryResult<IResponseGlobal<IRefundReportItem[]>> {
  const { status, startDate, endDate } = filters;
  return useQuery({
    queryKey: [
      "reports",
      "refundRequests",
      status,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () =>
      ReportsService.getRefundRequestsReport(status, startDate, endDate),
  });
}

/**
 * Hook to fetch promo usage report.
 * @param startDate - The start date for the report.
 * @param endDate - The end date for the report.
 * @returns A UseQueryResult for the promo usage report.
 */
export function usePromoUsageReport(
  startDate: Date,
  endDate: Date
): UseQueryResult<IResponseGlobal<IPromoUsageReport>> {
  return useQuery({
    queryKey: [
      "reports",
      "promoUsage",
      startDate.toISOString(),
      endDate.toISOString(),
    ],
    queryFn: () => ReportsService.getPromoUsageReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}
