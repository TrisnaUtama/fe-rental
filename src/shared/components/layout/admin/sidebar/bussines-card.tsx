import React, { useState, useMemo, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

import type {
  IOverallBusinessSummary,
  DateRange,
} from "@/features/admin/protected/report/types/report";
import { useOverallBusinessSummary } from "@/features/admin/protected/report/hooks/useReport";

const Badge: React.FC<{
  variant?: "outline" | "default";
  className?: string;
  children: React.ReactNode;
}> = ({ variant, className, children }) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 text-gray-800"
      : "bg-blue-500 text-white";
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
};

const Card = forwardRef<
  HTMLDivElement,
  { className?: string; children: React.ReactNode }
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}
  >
    {children}
  </div>
));
Card.displayName = "Card";

const CardHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardDescription: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

const CardTitle: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </h3>
);

const CardFooter: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const calculatePercentageChange = (
  current: number,
  previous: number
): string => {
  if (previous === 0) return current === 0 ? "0%" : "N/A";
  const change = ((current - previous) / previous) * 100;
  return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
};

export function BusinessSummaryCards() {
  const [currentDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 29);
    return { from, to };
  });

  const currentQueryEndDate = useMemo(() => {
    if (!currentDateRange.to) return null;
    const endDate = new Date(currentDateRange.to);
    endDate.setUTCHours(23, 59, 59, 999);
    return endDate;
  }, [currentDateRange.to]);

  const previousPeriodDateRange = useMemo<DateRange>(() => {
    if (!currentDateRange.from || !currentDateRange.to) {
      return { from: null, to: null };
    }

    const durationMs =
      currentQueryEndDate!.getTime() - currentDateRange.from.getTime();

    const prevTo = new Date(currentDateRange.from);
    prevTo.setUTCHours(0, 0, 0, 0);
    prevTo.setUTCDate(prevTo.getUTCDate() - 1);

    const prevFrom = new Date(prevTo.getTime() - durationMs);
    prevFrom.setUTCHours(0, 0, 0, 0);

    prevTo.setUTCHours(23, 59, 59, 999);

    return { from: prevFrom, to: prevTo };
  }, [currentDateRange.from, currentQueryEndDate]);

  const {
    data: currentSummaryResponse,
    isLoading: isLoadingCurrent,
    error: currentError,
  } = useOverallBusinessSummary(currentDateRange.from!, currentQueryEndDate!);

  const currentSummary: IOverallBusinessSummary | null =
    currentSummaryResponse?.data || null;

  const {
    data: previousSummaryResponse,
    isLoading: isLoadingPrevious,
    error: previousError,
  } = useOverallBusinessSummary(
    previousPeriodDateRange.from!,
    previousPeriodDateRange.to!
  );

  const previousSummary: IOverallBusinessSummary | null =
    previousSummaryResponse?.data || null;

  const isLoading = isLoadingCurrent || isLoadingPrevious;
  const error = currentError || previousError;

  const netRevenueTrend =
    currentSummary?.netRevenue !== undefined &&
    previousSummary?.netRevenue !== undefined
      ? calculatePercentageChange(
          currentSummary.netRevenue,
          previousSummary.netRevenue
        )
      : "N/A";

  const totalBookingsTrend =
    currentSummary?.totalBookings !== undefined &&
    previousSummary?.totalBookings !== undefined
      ? calculatePercentageChange(
          currentSummary.totalBookings,
          previousSummary.totalBookings
        )
      : "N/A";

  const confirmedBookingsTrend =
    currentSummary?.confirmedBookings !== undefined &&
    previousSummary?.confirmedBookings !== undefined
      ? calculatePercentageChange(
          currentSummary.confirmedBookings,
          previousSummary.confirmedBookings
        )
      : "N/A";

  const totalRefundsTrend =
    currentSummary?.totalRefunds !== undefined &&
    previousSummary?.totalRefunds !== undefined
      ? calculatePercentageChange(
          currentSummary.totalRefunds,
          previousSummary.totalRefunds
        )
      : "N/A";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="absolute right-4 top-4 h-6 w-16 bg-gray-200 rounded-lg"></div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <Card className="p-6 text-center bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="mx-auto h-10 w-10 mb-3" />
          <p className="text-lg font-semibold">Error Loading Summary</p>
          <p className="text-sm mt-1">
            {error.message || "An unexpected error occurred."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:shadow-xs grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
      <Card className="@container/card data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card">
        <CardHeader className="relative">
          <CardDescription>Net Revenue</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {currentSummary
              ? formatCurrency(currentSummary.netRevenue)
              : formatCurrency(0)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {netRevenueTrend}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Net revenue performance this period
          </div>
          <div className="text-muted-foreground">
            Based on paid bookings minus refunds
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total Bookings</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {currentSummary ? currentSummary.totalBookings : 0}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {totalBookingsTrend}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total number of bookings made
          </div>
          <div className="text-muted-foreground">
            Includes all statuses within the period
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card">
        <CardHeader className="relative">
          <CardDescription>Confirmed Bookings</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {currentSummary ? currentSummary.confirmedBookings : 0}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {confirmedBookingsTrend}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Successfully confirmed bookings
          </div>
          <div className="text-muted-foreground">
            Key indicator of operational success
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card dark:data-[slot=card]:bg-card">
        <CardHeader className="relative">
          <CardDescription>Total Refunded</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {currentSummary
              ? formatCurrency(currentSummary.totalRefunds)
              : formatCurrency(0)}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {totalRefundsTrend}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total amount of refunds processed
          </div>
          <div className="text-muted-foreground">
            Reflects successful refund operations
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
