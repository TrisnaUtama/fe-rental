import { useState, useRef, useMemo, forwardRef } from "react";
import {
  Printer,
  X,
  DollarSign,
  Users,
  ClipboardList,
  Ban,
  CheckCircle,
  AlertCircle,
  Undo2,
} from "lucide-react";

import {
  useOverallBusinessSummary,
  useOperationalBookingStatus,
} from "../../hooks/useReport";
import type {
  DateRange,
  IOverallBusinessSummary,
  IBookingReportItem,
  Booking_Status,
} from "../../types/report";
const BOOKING_STATUS_OPTIONS: Booking_Status[] = [
  "SUBMITTED",
  "PAYMENT_PENDING",
  "RECEIVED",
  "CONFIRMED",
  "COMPLETE",
  "CANCELED",
  "REJECTED_BOOKING",
  "REJECTED_REFUND",
  "REJECTED_RESHEDULE",
  "RESCHEDULE_REQUESTED",
  "RESCHEDULED",
  "REFUND_REQUESTED",
  "REFUNDED",
];

import { EnhancedDatePicker } from "../ui/EnchantedDatePicker";
import { DataTable, type Column } from "../reports/DataTable";
import { PaymentStatusBadge } from "../ui/PaymentStatusBadge";
import { BookingStatusBadge } from "../ui/BookingStatusBadge";

const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}> = forwardRef(({ className, children }, ref) => (
  <div
    ref={ref}
    className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
));

const StatCard = ({
  icon,
  title,
  value,
  color = "blue",
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color?: string;
}) => {
  const colorClasses: { [key: string]: { bg: string; text: string } } = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    gray: { bg: "bg-gray-100", text: "text-gray-600" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
  };
  const selectedColor = colorClasses[color] || colorClasses.blue;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div
          className={`p-3 rounded-lg ${selectedColor.bg} ${selectedColor.text}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default function OverallBusinessSummaryReport() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 29); 
    return { from, to };
  });
  const [statusFilter, setStatusFilter] = useState<Booking_Status | "">("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>(""); 

  const printContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null); 

  const availableMonths = useMemo(
    () => [
      { value: "1", label: "January" },
      { value: "2", label: "February" },
      { value: "3", label: "March" },
      { value: "4", label: "April" },
      { value: "5", label: "May" },
      { value: "6", label: "June" },
      { value: "7", label: "July" },
      { value: "8", label: "August" },
      { value: "9", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ],
    []
  );

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));
  }, []);

  const queryDateRange = useMemo(() => {
    let from: Date | null = null;
    let to: Date | null = null;
    const today = new Date();
    const currentYear = today.getFullYear();

    if (year) {
      const selectedYearInt = parseInt(year, 10);
      from = new Date(selectedYearInt, 0, 1); 
      to = new Date(selectedYearInt, 11, 31); 
    }

    if (month) {
      const selectedMonthInt = parseInt(month, 10) - 1;
      const targetYear = year ? parseInt(year, 10) : currentYear;
      from = new Date(targetYear, selectedMonthInt, 1);
      to = new Date(targetYear, selectedMonthInt + 1, 0); 
    }

    if (!month && !year) {
      if (dateRange.from && dateRange.to) {
        from = dateRange.from;
        to = dateRange.to;
      } else {
        const defaultTo = new Date();
        const defaultFrom = new Date();
        defaultFrom.setDate(defaultTo.getDate() - 29);

        from = defaultFrom;
        to = defaultTo;
      }
    }

    if (to) {
      to.setHours(23, 59, 59, 999);
    }
    if (from) {
      from.setHours(0, 0, 0, 0);
    }

    if (!from || !to) {
      const defaultTo = new Date();
      const defaultFrom = new Date();
      defaultFrom.setDate(defaultTo.getDate() - 29);
      defaultTo.setHours(23, 59, 59, 999);
      return { from: defaultFrom, to: defaultTo };
    }

    return { from, to };
  }, [dateRange.from, dateRange.to, month, year]);

  const {
    data: summaryResponse,
    isLoading: isLoadingSummary,
    error: summaryError,
  } = useOverallBusinessSummary(queryDateRange.from!, queryDateRange.to!); 

  const {
    data: bookingsResponse,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useOperationalBookingStatus({
    status: statusFilter as Booking_Status,
    startDate: queryDateRange.from!, 
    endDate: queryDateRange.to!, 
  });

  const summary: IOverallBusinessSummary | null = summaryResponse?.data || null;
  const bookings: IBookingReportItem[] = bookingsResponse?.data || [];

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    setMonth(""); 
    setYear("");
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    if (newMonth || year) {
      setDateRange({ from: null, to: null });
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    if (month || newYear) {
      setDateRange({ from: null, to: null });
    }
  };

  const resetFilters = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 29);
    setDateRange({ from, to });
    setStatusFilter("");
    setMonth("");
    setYear(""); 
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: Date | null) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "...";

  const handlePrint = () => {
    if (!printContainerRef.current || !tableRef.current) return;

    const reportPeriodString = `${formatDate(
      queryDateRange.from
    )} - ${formatDate(queryDateRange.to)}`;

    const tableClone = tableRef.current.cloneNode(true) as HTMLElement;
    const tableHtml = tableClone.outerHTML;

    const printWindow = window.open("", "", "height=800,width=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Overall Business Summary Report</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              -webkit-print-color-adjust: exact; 
              margin: 1.5cm; /* Standard print margin */
            } 
            @page { 
              size: A4; 
              margin: 1.5cm; 
            }
            .no-print { display: none !important; }
            /* Table specific print styles for better layout */
            table { 
              border-collapse: collapse; 
              width: 100%; 
              table-layout: auto; /* Allow column width to adjust based on content */
            } 
            th, td { 
              padding: 0.4rem 0.6rem; /* Reduced padding */
              border: 1px solid #e5e7eb; 
              text-align: left; 
              font-size: 0.75rem; /* Reduced font size */
              word-break: break-word; /* Ensure long words break */
            } 
            thead { 
              background-color: #f9fafb; 
              display: table-header-group !important; /* Repeat header on each page */
            } 
            tr { page-break-inside: avoid !important; } /* Avoid breaking rows across pages */
            
            /* Ensure the content itself scales well within print area */
            .mx-auto { max-width: 100% !important; } /* Override max-width for print */
            .p-8 { padding: 0; } /* Reduce padding for print to maximize space */
          </style>
        </head>
        <body class="bg-white">
          <div class="mx-auto">
            <header class="flex justify-between items-start pb-4 border-b-2 border-gray-800 mb-6">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Overall Business Summary</h1>
                <p class="text-sm text-gray-600">Period: ${reportPeriodString}</p>
                <p class="text-sm text-gray-600 mt-1">Generated on: ${new Date().toLocaleString(
                  "id-ID",
                  { dateStyle: "full", timeStyle: "short" }
                )}</p>
              </div>
              <div class="text-right">
                <h2 class="text-lg font-semibold text-gray-800">XYZ</h2>
                <p class="text-xs text-gray-500">Jl. XYZ</p>
              </div>
            </header>
            <section class="my-6">
              <div class="grid grid-cols-3 gap-6 mb-6">
                ${statCards
                  .map(
                    (card) => `
                  <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-500">${
                          card.title
                        }</p>
                        <p class="text-2xl font-bold text-gray-800 mt-1">${
                          card.value
                        }</p>
                      </div>
                      <div class="p-3 rounded-lg ${
                        card.color === "green"
                          ? "bg-green-100 text-green-600"
                          : card.color === "purple"
                          ? "bg-purple-100 text-purple-600"
                          : card.color === "yellow"
                          ? "bg-yellow-100 text-yellow-600"
                          : card.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : card.color === "indigo"
                          ? "bg-indigo-100 text-indigo-600"
                          : card.color === "red"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }">
                        </div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </section>
            <main class="mt-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Booking Details</h2>
                <div class="overflow-x-auto">${tableHtml}</div>
            </main>
            <footer class="text-center text-xs text-gray-400 mt-8 pt-4 border-t"><p>Confidential &copy; ${new Date().getFullYear()} Your Company Name</p></footer>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const statCards = [
    {
      icon: <DollarSign size={22} />,
      title: "Net Revenue",
      value: summary ? formatCurrency(summary.netRevenue) : "Rp0",
      color: "green",
      key: "netRevenue",
    },
    {
      icon: <Users size={22} />,
      title: "Total Revenue",
      value: summary ? formatCurrency(summary.totalRevenue) : "Rp0",
      color: "purple",
      key: "totalRevenue",
    },
    {
      icon: <Undo2 size={22} />,
      title: "Total Refunded",
      value: summary ? formatCurrency(summary.totalRefunds) : "Rp0",
      color: "yellow",
      key: "totalRefunds",
    },
    {
      icon: <ClipboardList size={22} />,
      title: "Total Bookings",
      value: summary ? summary.totalBookings : 0,
      color: "blue",
      key: "totalBookings",
    },
    {
      icon: <CheckCircle size={22} />,
      title: "Confirmed Bookings",
      value: summary ? summary.confirmedBookings : 0,
      color: "indigo",
      key: "confirmedBookings",
    },
    {
      icon: <Ban size={22} />,
      title: "Canceled Bookings",
      value: summary ? summary.canceledBookings : 0,
      color: "red",
      key: "canceledBookings",
    },
  ];

  const bookingColumns: Column<IBookingReportItem>[] = [
    {
      header: "Booking ID",
      accessor: "id",
      cellClassName: "font-mono text-xs text-gray-700",
    },
    {
      header: "Customer",
      accessor: (item) => item.users.name,
      cellClassName: "font-medium text-gray-800",
    },
    {
      header: "Booking Date",
      accessor: (item) =>
        new Date(item.created_at).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      cellClassName: "text-gray-600",
    },
    {
      header: "Total Amount",
      accessor: (item) => formatCurrency(Number(item.total_price)),
      className: "text-right",
      cellClassName: "text-gray-800 text-right font-semibold",
    },
    {
      header: "Payment",
      accessor: (item) => (
        <PaymentStatusBadge status={item.Payments[0]?.payment_status} />
      ),
      className: "text-center",
    },
    {
      header: "Booking Status",
      accessor: (item) => <BookingStatusBadge status={item.status} />,
      className: "text-center",
    },
  ];
  const error = summaryError || bookingsError;

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Overall Business Summary
          </h1>
          <p className="text-md text-gray-600 mt-1">
            A high-level overview of your business performance.
          </p>
        </header>

        <div
          ref={printContainerRef}
          className="print-area-summary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
        >
          {isLoadingSummary
            ? Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </Card>
              ))
            : statCards.map((card) => (
                <StatCard
                  key={card.key}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  color={card.color}
                />
              ))}
        </div>

        <Card className="px-6 py-4 mb-6 no-print">
          <div className="grid gap-4 items-end sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-cols-fr">
            <div className="min-w-[180px]">
              <label
                htmlFor="month-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Month
              </label>
              <select
                id="month-filter"
                value={month}
                onChange={handleMonthChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Any</option>
                {availableMonths.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[180px]">
              <label
                htmlFor="year-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year
              </label>
              <select
                id="year-filter"
                value={year}
                onChange={handleYearChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Any</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[200px]">
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Booking Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as Booking_Status | "")
                }
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 capitalize transition-all"
              >
                <option value="">All Statuses</option>
                {BOOKING_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[240px] max-w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <EnhancedDatePicker
                date={dateRange}
                onDateChange={handleDateRangeChange}
                disabled={!!month || !!year}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            >
              <X className="w-4 h-4 mr-2" /> Reset Filters
            </button>
            <button
              onClick={handlePrint}
              disabled={isLoadingSummary || isLoadingBookings}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Report
            </button>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <DataTable
            columns={bookingColumns}
            data={bookings}
            isLoading={isLoadingBookings}
            error={bookingsError as Error | null}
            tableRef={tableRef}
          />
          <footer className="text-center p-4 text-sm text-gray-500 border-t border-gray-100">
            <p>Displaying {bookings.length} booking(s).</p>
          </footer>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mt-6 p-8 text-center bg-red-50 text-red-700">
            <AlertCircle className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-semibold">Could Not Load Data</h3>
            <p className="mt-1 text-sm">
              {(error as Error)?.message || "An unexpected error occurred."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
