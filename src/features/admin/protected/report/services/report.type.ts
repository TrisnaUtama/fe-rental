import { httpRequest } from "@/shared/utils/http-client";
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
} from "../types/report";

const API_REPORTS_BASE_URL = `${import.meta.env.VITE_API_KEY}reports/`;

function formatDateToISO(date?: Date): string | undefined {
  return date ? date.toISOString() : undefined;
}

/**
 * Service functions for accessing various administrative reports from the backend.
 * Each function corresponds to a specific report endpoint.
 */
export const ReportsService = {
  // Changed from `Get` to `ReportsService` for better naming convention

  /**
   * Fetches the overall business summary.
   * @param startDate - The start date for the report.
   * @param endDate - The end date for the report.
   * @returns A promise resolving to a global response containing the summary data.
   */
  async getOverallBusinessSummary(
    startDate: Date,
    endDate: Date
  ): Promise<IResponseGlobal<IOverallBusinessSummary>> {
    const params = new URLSearchParams({
      startDate: formatDateToISO(startDate)!,
      endDate: formatDateToISO(endDate)!,
    });
    return await httpRequest<IResponseGlobal<IOverallBusinessSummary>>(
      `${API_REPORTS_BASE_URL}overall-business-summary?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches the financial summary.
   * @param startDate - The start date for the report.
   * @param endDate - The end date for the report.
   * @returns A promise resolving to a global response containing the financial summary data.
   */
  async getFinancialSummary(
    startDate?: Date,
    endDate?: Date
  ): Promise<IResponseGlobal<IFinancialSummary>> {
    const params = new URLSearchParams({
      startDate: formatDateToISO(startDate)!,
      endDate: formatDateToISO(endDate)!,
    });
    return await httpRequest<IResponseGlobal<IFinancialSummary>>(
      `${API_REPORTS_BASE_URL}financial-summary?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches a report of all ratings.
   * @param ratedType - Optional: Filter ratings by entity type.
   * @returns A promise resolving to a global response containing an array of rating items.
   */
  async getRatingsReport(
    ratedType?: RatedEntityType // Uses the string literal union type
  ): Promise<IResponseGlobal<IRatingReportItem[]>> {
    const params = new URLSearchParams();
    if (ratedType) {
      params.append("ratedType", ratedType);
    }
    return await httpRequest<IResponseGlobal<IRatingReportItem[]>>(
      `${API_REPORTS_BASE_URL}ratings-report?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches the average ratings per entity type.
   * @returns A promise resolving to a global response containing average ratings data.
   */
  async getAverageRatingsPerEntity(): Promise<
    IResponseGlobal<IAverageRatingsPerEntity>
  > {
    return await httpRequest<IResponseGlobal<IAverageRatingsPerEntity>>(
      `${API_REPORTS_BASE_URL}average-ratings-per-entity`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches operational booking status report.
   * @param status - The booking status to filter by.
   * @param startDate - Optional: Start date for filtering bookings.
   * @param endDate - Optional: End date for filtering bookings.
   * @returns A promise resolving to a global response containing an array of booking items.
   */
  async getOperationalBookingStatus(
    status?: Booking_Status,
    startDate?: Date,
    endDate?: Date
  ): Promise<IResponseGlobal<IBookingReportItem[]>> {
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    if (startDate) params.append("startDate", formatDateToISO(startDate)!);
    if (endDate) params.append("endDate", formatDateToISO(endDate)!);

    return await httpRequest<IResponseGlobal<IBookingReportItem[]>>(
      `${API_REPORTS_BASE_URL}operational-booking-status?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches reschedule requests report.
   * @param status - Optional: Reschedule status to filter by.
   * @param startDate - Optional: Start date for filtering requests.
   * @param endDate - Optional: End date for filtering requests.
   * @returns A promise resolving to a global response containing an array of reschedule request items.
   */
  async getRescheduleRequestsReport(
    status?: RescheduleStatus, // Uses the string literal union type
    startDate?: Date,
    endDate?: Date
  ): Promise<IResponseGlobal<IRescheduleRequestReportItem[]>> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (startDate) params.append("startDate", formatDateToISO(startDate)!);
    if (endDate) params.append("endDate", formatDateToISO(endDate)!);

    return await httpRequest<IResponseGlobal<IRescheduleRequestReportItem[]>>(
      `${API_REPORTS_BASE_URL}reschedule-requests?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches vehicle utilization report.
   * @param startDate - The start date for the report.
   * @param endDate - The end date for the report.
   * @returns A promise resolving to a global response containing vehicle utilization data.
   */
  async getVehicleUtilizationReport(
    startDate: Date,
    endDate: Date
  ): Promise<IResponseGlobal<IVehicleUtilizationReport>> {
    const params = new URLSearchParams({
      startDate: formatDateToISO(startDate)!,
      endDate: formatDateToISO(endDate)!,
    });
    return await httpRequest<IResponseGlobal<IVehicleUtilizationReport>>(
      `${API_REPORTS_BASE_URL}vehicle-utilization?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  async getDailyBusinessSummary(
    startDate: Date,
    endDate: Date
  ): Promise<IResponseGlobal<IDailyBusinessSummaryItem[]>> {
    const params = new URLSearchParams({
      startDate: formatDateToISO(startDate)!,
      endDate: formatDateToISO(endDate)!,
    });
    return await httpRequest<IResponseGlobal<IDailyBusinessSummaryItem[]>>(
      `${API_REPORTS_BASE_URL}daily-summary?${params.toString()}`, 
      {
        method: "GET",
        credentials: "include",
      }
    );
  },


  async getTravelPackagePopularityReport(
    startDate: Date,
    endDate: Date
  ): Promise<IResponseGlobal<ITravelPackagePopularityReport>> {
    const params = new URLSearchParams({
      startDate: formatDateToISO(startDate)!,
      endDate: formatDateToISO(endDate)!,    
    });
    return await httpRequest<IResponseGlobal<ITravelPackagePopularityReport>>(
      `${API_REPORTS_BASE_URL}travel-package-popularity?${params.toString()}`,
      {
        method: "GET",    
        credentials: "include", 
      }
    );
  },

  /**
   * Fetches users and drivers report.
   * @param role - Optional: User role to filter by.
   * @returns A promise resolving to a global response containing an array of user items.
   */
  async getUsersAndDriversReport(
    role?: Roles
  ): Promise<IResponseGlobal<IUserReportItem[]>> {
    const params = new URLSearchParams();
    if (role) {
      params.append("role", role);
    }
    return await httpRequest<IResponseGlobal<IUserReportItem[]>>(
      `${API_REPORTS_BASE_URL}users-and-drivers?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches payment transactions report.
   * @param status - Optional: Payment status to filter by.
   * @param startDate - Optional: Start date for filtering payments.
   * @param endDate - Optional: End date for filtering payments.
   * @returns A promise resolving to a global response containing an array of payment items.
   */
  async getPaymentTransactionsReport(
    status?: Payment_Status,
    startDate?: Date,
    endDate?: Date
  ): Promise<IResponseGlobal<IPaymentReportItem[]>> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (startDate) params.append("startDate", formatDateToISO(startDate)!);
    if (endDate) params.append("endDate", formatDateToISO(endDate)!);

    return await httpRequest<IResponseGlobal<IPaymentReportItem[]>>(
      `${API_REPORTS_BASE_URL}payment-transactions?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches refund requests report.
   * @param status - Optional: Refund status to filter by.
   * @param startDate - Optional: Start date for filtering refunds.
   * @param endDate - Optional: End date for filtering refunds.
   * @returns A promise resolving to a global response containing an array of refund items.
   */
  async getRefundRequestsReport(
    status?: Refund_Status, 
    startDate?: Date,
    endDate?: Date
  ): Promise<IResponseGlobal<IRefundReportItem[]>> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (startDate) params.append("startDate", formatDateToISO(startDate)!);
    if (endDate) params.append("endDate", formatDateToISO(endDate)!);

    return await httpRequest<IResponseGlobal<IRefundReportItem[]>>(
      `${API_REPORTS_BASE_URL}refund-requests?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },

  /**
   * Fetches promo usage report.
   * @param startDate - The start date for the report.
   * @param endDate - The end date for the report.
   * @returns A promise resolving to a global response containing promo usage data.
   */
  async getPromoUsageReport(
    startDate: Date,
    endDate: Date
  ): Promise<IResponseGlobal<IPromoUsageReport>> {
    const params = new URLSearchParams({
      startDate: formatDateToISO(startDate)!,
      endDate: formatDateToISO(endDate)!,
    });
    return await httpRequest<IResponseGlobal<IPromoUsageReport>>(
      `${API_REPORTS_BASE_URL}promo-usage?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
  },
};
