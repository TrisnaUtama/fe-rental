import { useState, useRef, useMemo, forwardRef } from "react";
import {
  Printer,
  X,
  Users, 
  UserRoundCheck, 
  AlertCircle,
} from "lucide-react";

import { useUsersAndDriversReport } from "../../hooks/useReport";
import type {
  DateRange,
  IUserReportItem,
  Roles, 
} from "../../types/report"; 

import { DataTable, type Column } from "../reports/DataTable";

const ROLE_OPTIONS: Roles[] = [
  "SUPERADMIN",
  "ADMIN_OPERATIONAL",
  "ADMIN_FINANCE",
  "CUSTOMER",
];

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

export default function UsersAndDriversReport() {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    return { from, to };
  });
  const [roleFilter, setRoleFilter] = useState<Roles | "">("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const printContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

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
        defaultFrom.setMonth(defaultTo.getMonth() - 1);

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
      defaultFrom.setMonth(defaultTo.getMonth() - 1);
      defaultTo.setHours(23, 59, 59, 999);
      return { from: defaultFrom, to: defaultTo };
    }

    return { from, to };
  }, [dateRange.from, dateRange.to, month, year]);

  const {
    data: usersResponse,
    isLoading,
    error,
  } = useUsersAndDriversReport(roleFilter === "" ? undefined : roleFilter);

  const users: IUserReportItem[] = usersResponse?.data || [];

  const totalUsers = users.length;
  const totalCustomers = users.filter(
    (user) => user.role === "CUSTOMER"
  ).length;

  const resetFilters = () => {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 1);
    setDateRange({ from, to });
    setRoleFilter("");
    setMonth("");
    setYear("");
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
          <title>Users Report</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              -webkit-print-color-adjust: exact; 
              margin: 1.5cm; 
            } 
            @page { 
              size: A4; 
              margin: 1.5cm; 
            }
            .no-print { display: none !important; }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              table-layout: auto; 
            } 
            th, td { 
              padding: 0.4rem 0.6rem; 
              border: 1px solid #e5e7eb; 
              text-align: left; 
              font-size: 0.75rem; 
              word-break: break-word; 
            } 
            thead { 
              background-color: #f9fafb; 
              display: table-header-group !important; 
            } 
            tr { page-break-inside: avoid !important; }
            .mx-auto { max-width: 100% !important; } 
            .p-8 { padding: 0; }
          </style>
        </head>
        <body class="bg-white">
          <div class="mx-auto">
            <header class="flex justify-between items-start pb-4 border-b-2 border-gray-800 mb-6">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Users Report</h1>
                <p class="text-sm text-gray-600">Period: ${reportPeriodString}</p>
                <p class="text-sm text-gray-600 mt-1">Generated on: ${new Date().toLocaleString(
                  "id-ID",
                  { dateStyle: "full", timeStyle: "short" }
                )}</p>
              </div>
              <div class="text-right">
                <h2 class="text-lg font-semibold text-gray-800">Bintang Bali Transport</h2>
                <p class="text-xs text-gray-500">Jl. Jenderal Sudirman No. 123, Jakarta</p>
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
                        card.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : card.color === "green"
                          ? "bg-green-100 text-green-600"
                          : card.color === "indigo"
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-600"
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
                <h2 class="text-2xl font-bold text-gray-800 mb-4">User Details</h2>
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
      icon: <Users size={22} />,
      title: "Total Users",
      value: isLoading ? "..." : totalUsers,
      color: "blue",
      key: "totalUsers",
    },
    {
      icon: <UserRoundCheck size={22} />,
      title: "Total Customers",
      value: isLoading ? "..." : totalCustomers,
      color: "green",
      key: "totalCustomers",
    },
  ];

  const userColumns: Column<IUserReportItem>[] = [
    {
      header: "User ID",
      accessor: "id",
      cellClassName: "font-mono text-xs text-gray-700",
    },
    {
      header: "Name",
      accessor: "name",
      cellClassName: "font-medium text-gray-800",
    },
    { header: "Email", accessor: "email", cellClassName: "text-gray-600" },
    {
      header: "Role",
      accessor: "role",
      cellClassName: "font-semibold capitalize",
    },
    {
      header: "Registered Date",
      accessor: (item) => formatDate(new Date(item.created_at)),
      cellClassName: "text-gray-600",
    },
    {
      header: "Phone Number",
      accessor: "phone_number",
      cellClassName: "text-gray-600",
    },
  ];

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Users  Report
          </h1>
          <p className="text-md text-gray-600 mt-1">
            Detailed report on registered users.
          </p>
        </header>

        <div
          ref={printContainerRef}
          className="print-area-summary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6"
        >
          {isLoading
            ? Array.from({ length: 2 }).map(
                (
                  _,
                  index
                ) => (
                  <Card key={index} className="p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                  </Card>
                )
              )
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label
                htmlFor="role-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                User Role
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as Roles | "")}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 capitalize transition-all"
              >
                <option value="">All Roles</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
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
              disabled={isLoading || users.length === 0}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Report
            </button>
          </div>
        </Card>

        {/* Users Details Table */}
        <Card className="p-0 overflow-hidden">
          <DataTable
            columns={userColumns}
            data={users}
            isLoading={isLoading}
            error={error as Error | null}
            tableRef={tableRef}
          />
          <footer className="text-center p-4 text-sm text-gray-500 border-t border-gray-100">
            <p>Displaying {users.length} user(s).</p>
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
