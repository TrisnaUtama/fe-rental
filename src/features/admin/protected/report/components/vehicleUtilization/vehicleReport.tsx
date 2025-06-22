import { useState, useRef, useMemo } from "react";
import { Printer, X, AlertCircle, Car, CalendarDays, Hash } from "lucide-react";
import { useVehicleUtilizationReport } from "../../hooks/useReport";
import type { DateRange, IVehicleUtilizationReport } from "../../types/report";
import { DataTable, type Column } from "../reports/DataTable";
import { StatCard } from "../reports/StatCard";
import { Card } from "../ui/Card";
import { EnhancedDatePicker } from "../ui/EnchantedDatePicker";

interface IVehicleUtilizationItem {
  id: string;
  name: string;
  bookingCount: number;
  totalBookedDays: number;
}

export default function VehicleUtilizationReport() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    return { from, to };
  });
  const [month, setMonth] = useState<string>(""); 
  const [year, setYear] = useState<string>(""); 

  const printRef = useRef<HTMLDivElement>(null);

  const availableMonths = useMemo(() => [
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
  ], []);

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    // Generate years from 2 years before current year to 2 years after
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
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const tomorrowEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); 
        
        from = todayStart;
        to = tomorrowEnd;
      }
    }

    if (to) {
      to.setHours(23, 59, 59, 999);
    }
    if (from) {
        from.setHours(0, 0, 0, 0);
    }

    if (!from || !to) {
        const defaultFrom = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const defaultTo = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        defaultTo.setHours(23, 59, 59, 999);
        return { from: defaultFrom, to: defaultTo };
    }


    return { from, to };
  }, [dateRange.from, dateRange.to, month, year]);


  const {
    data: utilizationResponse,
    isLoading,
    error,
  } = useVehicleUtilizationReport(queryDateRange.from!, queryDateRange.to!);

  const vehicleUtilization: IVehicleUtilizationReport | null | undefined =
    utilizationResponse?.data;

  const utilizationData: IVehicleUtilizationItem[] = useMemo(() => {
    if (!vehicleUtilization) return [];
    return Object.entries(vehicleUtilization).map(([id, data]) => ({
      id,
      name: data.name,
      bookingCount: data.bookingCount,
      totalBookedDays: data.totalBookedDays,
    }));
  }, [vehicleUtilization]);

  const totalVehiclesBooked = utilizationData.length;
  const totalBookingCount = utilizationData.reduce(
    (sum, item) => sum + item.bookingCount,
    0
  );
  const totalBookedDays = utilizationData.reduce(
    (sum, item) => sum + item.totalBookedDays,
    0
  );

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
    setMonth("");
    setYear("");
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    setDateRange({ from: today, to: tomorrow });
  };

  const formatDate = (date: Date | null) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "...";

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = `
      <html>
      <head>
        <title>Vehicle Utilization Report</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
          @page { size: A4; margin: 1.5cm; }
          .no-print { display: none !important; }
          table { border-collapse: collapse; width: 100%; }
          .no-break { page-break-inside: avoid; }
        </style>
      </head>
      <body class="bg-white">
        <div class="mx-auto">
          <header class="flex justify-between items-start pb-4 border-b-2 border-gray-800 mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Vehicle Utilization Report</h1>
              <p class="text-sm text-gray-600">Generated on: ${new Date().toLocaleString(
                "id-ID",
                { dateStyle: "full", timeStyle: "short" }
              )}</p>
            </div>
            <div class="text-right">
              <h2 class="text-lg font-semibold text-gray-800">Your Company Name</h2>
              <p class="text-xs text-gray-500">Jl. Jenderal Sudirman No. 123, Jakarta</p>
            </div>
          </header>

          <section class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 no-break">
              <p class="text-sm font-medium text-green-800">Total Vehicles Booked</p>
              <p class="text-2xl font-bold text-green-900">${totalVehiclesBooked}</p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 no-break">
              <p class="text-sm font-medium text-blue-800">Total Booking Count</p>
              <p class="text-2xl font-bold text-blue-900">${totalBookingCount}</p>
            </div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 no-break">
              <p class="text-sm font-medium text-yellow-800">Total Booked Days</p>
              <p class="text-2xl font-bold text-yellow-900">${totalBookedDays}</p>
            </div>
          </section>

          <section class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Vehicle Utilization Details</h3>
            <div class="overflow-x-auto">
              <table class="w-full border border-gray-300">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">Vehicle Name</th>
                    <th class="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700">Booking Count</th>
                    <th class="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700">Total Booked Days</th>
                  </tr>
                </thead>
                <tbody>
                  ${utilizationData
                    .map(
                      (item) => `
                    <tr>
                      <td class="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800">${item.name}</td>
                      <td class="border border-gray-300 px-4 py-3 text-sm text-center text-gray-600">${item.bookingCount}</td>
                      <td class="border border-gray-300 px-4 py-3 text-sm text-center text-gray-600">${item.totalBookedDays}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </section>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p class="text-sm font-medium text-gray-800">Report Period</p>
            <p class="text-lg font-bold text-gray-900">${formatDate(
              queryDateRange.from
            )} — ${formatDate(queryDateRange.to)}</p>
          </div>

          <footer class="text-center text-xs text-gray-400 mt-8 pt-4 border-t">
            <p>Confidential &copy; ${new Date().getFullYear()} Your Company Name</p>
          </footer>
        </div>
      </body>
      </html>`;

    const printWindow = window.open("", "", "height=800,width=1200");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const utilizationColumns: Column<IVehicleUtilizationItem>[] = [
    {
      header: "Vehicle Name",
      accessor: "name",
      cellClassName: "font-semibold text-gray-800",
    },
    {
      header: "Booking Count",
      accessor: "bookingCount",
      className: "text-center",
      cellClassName: "text-center text-gray-600",
    },
    {
      header: "Total Booked Days",
      accessor: "totalBookedDays",
      className: "text-center",
      cellClassName: "text-center text-gray-600",
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className=" min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className=" min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 text-center bg-red-50 text-red-700">
            <AlertCircle className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-semibold">
              Could Not Load Report
            </h3>
            <p className="mt-1 text-sm">{error.message}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vehicle Utilization Report
            </h1>
            <p className="text-md text-gray-600 mt-1">
              Insights into how your vehicles are being utilized.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0 no-print">
            <button
              onClick={resetFilters}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <X className="w-4 h-4 mr-2" /> Reset Filters
            </button>
            <button
              onClick={handlePrint}
              disabled={isLoading || !vehicleUtilization}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Report
            </button>
          </div>
        </header>

        <Card className="p-4 mb-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex-grow">
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
            <div className="flex-grow">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <EnhancedDatePicker
                date={dateRange}
                onDateChange={setDateRange}
                disabled={!!month || !!year} 
              />
            </div>
          </div>
        </Card>

        {vehicleUtilization && utilizationData.length > 0 ? (
          <div ref={printRef}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                icon={<Car size={22} />}
                title="Total Vehicles Booked"
                value={totalVehiclesBooked}
                color="green"
              />
              <StatCard
                icon={<Hash size={22} />}
                title="Total Booking Count"
                value={totalBookingCount}
                color="blue"
              />
              <StatCard
                icon={<CalendarDays size={22} />}
                title="Total Booked Days"
                value={totalBookedDays}
                color="yellow"
              />
            </div>

            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Vehicle Utilization Details
              </h2>
              <DataTable
                columns={utilizationColumns}
                data={utilizationData}
                isLoading={isLoading}
                error={error}
                tableRef={null}
              />
            </Card>
          </div>
        ) : (
          <Card className="p-12 text-center text-gray-500">
            <Car className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Data Available
            </h3>
            <p>
              No vehicle utilization data available for the selected date range.
            </p>
            <p className="text-sm mt-2">
              Try selecting a different date range or check if there are any
              bookings in this period.
            </p>
          </Card>
        )}

        <footer className="text-center mt-6 text-sm text-gray-500">
          <p>
            Report period: {formatDate(queryDateRange.from)} —{" "}
            {formatDate(queryDateRange.to)}
          </p>
        </footer>
      </div>
    </div>
  );
}