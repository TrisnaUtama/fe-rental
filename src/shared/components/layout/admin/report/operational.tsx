import React, {
  useState,
  useMemo,
  forwardRef,
  type ReactNode,
  type FC,
} from "react";
import {
  useOperationalBookingStatus,
  useVehicleUtilizationReport,
  useRescheduleRequestsReport,
  useTravelPackagePopularityReport,
  useUsersAndDriversReport,
} from "@/features/admin/protected/report/hooks/useReport";
import type {
  IBookingReportItem,
  DateRange,
  IVehicleUtilizationReport,
  ITravelPackagePopularityReport,
} from "@/features/admin/protected/report/types/report";
import {
  AlertCircle,
  Car,
  Loader2,
  RefreshCw,
  Package,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { motion, type Variants } from "framer-motion";

const Card = forwardRef<
  HTMLDivElement,
  { className?: string; children: ReactNode }
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={`rounded-2xl border bg-white text-gray-900 shadow-sm transition-all hover:shadow-lg ${className}`}
  >
    {children}
  </div>
));
Card.displayName = "Card";

const CardHeader: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </h3>
);

const CardContent: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

const StatCard: FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
}> = ({ title, value, icon: Icon, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <Icon className="w-5 h-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

function RecentActivityTable({ dateRange }: { dateRange: DateRange }) {
  const {
    data: operationalBookings,
    isLoading,
    isError,
  } = useOperationalBookingStatus({
    startDate: dateRange.from!,
    endDate: dateRange.to!,
  });

  const activities = useMemo(() => {
    if (isLoading || isError || !operationalBookings?.data) return [];

    const pendingActivities = operationalBookings.data.filter(
      (item: IBookingReportItem) =>
        item.status === "SUBMITTED" ||
        item.status === "REFUND_REQUESTED" ||
        item.status === "RESCHEDULE_REQUESTED"
    );

    const mappedActivities = pendingActivities.map(
      (item: IBookingReportItem) => {
        let type = "New Booking";
        if (item.status === "REFUND_REQUESTED") type = "Refund Request";
        if (item.status === "RESCHEDULE_REQUESTED") type = "Reschedule Request";

        return {
          id: item.id,
          displayId: `Booking #${item.id.substring(0, 8).toUpperCase()}`,
          type: type,
          createdAt: new Date(item.created_at),
          link: `/staff/detail-booking/${item.id}`,
        };
      }
    );

    mappedActivities.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return mappedActivities;
  }, [operationalBookings, isLoading, isError]);

  if (isLoading) {
    return (
      <Card className="p-6 text-center h-full flex items-center justify-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 text-center h-full flex items-center justify-center text-red-600">
        <AlertCircle className="mx-auto h-8 w-8" />
        Error loading activities.
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pending Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-gray-200">
              {activities.slice(0, 7).map((activity) => (
                <li
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-center space-x-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.displayId}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        activity.type === "New Booking"
                          ? "bg-blue-100 text-blue-800"
                          : activity.type === "Refund Request"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {activity.type}
                    </p>
                    <Link to={activity.link}>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs mt-1"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>No pending actions in this period.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VehicleUtilizationList({ dateRange }: { dateRange: DateRange }) {
  const {
    data: utilizationData,
    isLoading,
    isError,
  } = useVehicleUtilizationReport(dateRange.from!, dateRange.to!);

  const utilizationList = useMemo(() => {
    if (isLoading || isError || !utilizationData?.data) return [];
    const dataArray = Object.values(
      utilizationData.data as IVehicleUtilizationReport
    );
    dataArray.sort((a, b) => b.bookingCount - a.bookingCount);
    return dataArray;
  }, [utilizationData, isLoading, isError]);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6 min-h-[150px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </Card>
    );
  }
  if (isError) {
    return (
      <Card className="flex items-center justify-center p-6 min-h-[150px] text-red-600">
        <AlertCircle className="h-6 w-6 mr-2" />
        Could not load utilization data.
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-600" />
          Top Utilized Vehicles
        </CardTitle>
      </CardHeader>
      <CardContent>
        {utilizationList.length > 0 ? (
          <ul className="space-y-4">
            {utilizationList.slice(0, 5).map((vehicle) => (
              <li
                key={vehicle.name}
                className="flex items-center justify-between gap-4"
              >
                <p className="text-sm font-medium text-gray-800 truncate">
                  {vehicle.name}
                </p>
                <div className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                  {vehicle.bookingCount} booking
                  {vehicle.bookingCount > 1 ? "s" : ""}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No vehicle utilization data.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function TravelPackagePopularityList({ dateRange }: { dateRange: DateRange }) {
  const {
    data: popularityData,
    isLoading,
    isError,
  } = useTravelPackagePopularityReport(dateRange.from!, dateRange.to!);

  const popularityList = useMemo(() => {
    if (isLoading || isError || !popularityData?.data) return [];
    const dataArray = Object.values(
      popularityData.data as ITravelPackagePopularityReport
    );
    dataArray.sort((a, b) => b.bookingCount - a.bookingCount);
    return dataArray;
  }, [popularityData, isLoading, isError]);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6 min-h-[150px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </Card>
    );
  }
  if (isError) {
    return (
      <Card className="flex items-center justify-center p-6 min-h-[150px] text-red-600">
        <AlertCircle className="h-6 w-6 mr-2" />
        Could not load package data.
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-green-600" />
          Popular Travel Packages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {popularityList.length > 0 ? (
          <ul className="space-y-4">
            {popularityList.slice(0, 5).map((pkg) => (
              <li
                key={pkg.name}
                className="flex items-center justify-between gap-4"
              >
                <p className="text-sm font-medium text-gray-800 truncate">
                  {pkg.name}
                </p>
                <div className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                  {pkg.bookingCount} booking{pkg.bookingCount > 1 ? "s" : ""}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No travel package data.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function NewUsersList() {
  const {
    data: usersData,
    isLoading,
    isError,
  } = useUsersAndDriversReport("CUSTOMER");

  const recentUsers = useMemo(() => {
    if (isLoading || isError || !usersData?.data) return [];
    const sortedUsers = [...usersData.data];
    sortedUsers.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sortedUsers;
  }, [usersData, isLoading, isError]);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6 min-h-[150px]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </Card>
    );
  }
  if (isError) {
    return (
      <Card className="flex items-center justify-center p-6 min-h-[150px] text-red-600">
        <AlertCircle className="h-6 w-6 mr-2" />
        Could not load user data.
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Recent Customer Sign-ups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentUsers.length > 0 ? (
          <ul className="space-y-4">
            {recentUsers.slice(0, 5).map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-4"
              >
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">No new users found.</p>
        )}
      </CardContent>
    </Card>
  );
}

function PendingReschedulesCard({ dateRange }: { dateRange: DateRange }) {
  const {
    data: rescheduleData,
    isLoading,
    isError,
  } = useRescheduleRequestsReport({
    status: "PENDING",
    startDate: dateRange.from!,
    endDate: dateRange.to!,
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <StatCard
      title="Pending Reschedule Requests"
      value={isError ? "Error" : rescheduleData?.data?.length ?? 0}
      icon={RefreshCw}
    />
  );
}

export default function StaffDashboard() {
  const [dateRange] = useState<DateRange>(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from, to };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <main className="space-y-8">
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            variants={itemVariants}
          >
            <PendingReschedulesCard dateRange={dateRange} />
            <NewUsersList />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            variants={itemVariants}
          >
            <div className="lg:col-span-2">
              <RecentActivityTable dateRange={dateRange} />
            </div>
            <div className="space-y-8">
              <VehicleUtilizationList dateRange={dateRange} />
              <TravelPackagePopularityList dateRange={dateRange} />
            </div>
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
