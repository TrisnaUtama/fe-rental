import React, { useState, useRef, useMemo } from "react";
import { Printer, X, DollarSign, Hash, Users } from "lucide-react";
import type { DateRange, Payment_Status } from "../../types/report";
import { usePaymentTransactionsReport } from "../../hooks/useReport";
import type { IPaymentReportItem } from "../../types/report";
import { DataTable, type Column } from "../reports/DataTable";
import { StatusBadge } from "../ui/StatusBadge";
import { StatCard } from "../reports/StatCard";
import { Card } from "../ui/Card";
import { EnhancedDatePicker } from "../ui/EnchantedDatePicker";

export default function PaymentTransactionReport() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [status, setStatus] = useState<Payment_Status | "">("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const tableRef = useRef<HTMLTableElement>(null);
  const queryEndDate = useMemo(() => {
    if (!dateRange.to) return undefined;
    const endDate = new Date(dateRange.to);
    endDate.setUTCHours(23, 59, 59, 999);
    return endDate;
  }, [dateRange.to]);

  const {
    data: transactionsResponse,
    isLoading,
    error,
  } = usePaymentTransactionsReport({
    status: status || undefined,
    startDate: dateRange.from || undefined,
    endDate: queryEndDate,
  });

  const transactions: IPaymentReportItem[] = transactionsResponse?.data || [];

  const filteredData = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter((t: IPaymentReportItem) => {
      const transactionDate = new Date(t.payment_date ?? t.created_at);
      if (month && transactionDate.getUTCMonth() + 1 !== parseInt(month))
        return false;
      if (year && transactionDate.getUTCFullYear() !== parseInt(year))
        return false;
      return true;
    });
  }, [transactions, month, year]);

  const reportSummary = useMemo(() => {
    const totalTransactions = filteredData.length;
    const totalRevenue = filteredData
      .filter((t) => t.payment_status === "PAID")
      .reduce((sum, t) => sum + Number(t.total_amount), 0);
    const uniqueCustomers = new Set(filteredData.map((t) => t.userId)).size;
    return { totalTransactions, totalRevenue, uniqueCustomers };
  }, [filteredData]);

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
    if (newDateRange.from || newDateRange.to) {
      setMonth("");
      setYear("");
    }
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    if (newMonth) {
      setDateRange({ from: null, to: null });
    }
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    if (newYear) {
      setDateRange({ from: null, to: null });
    }
  };
  const resetFilters = () => {
    setDateRange({ from: null, to: null });
    setStatus("");
    setMonth("");
    setYear("");
  };

  const handlePrint = () => {
    if (!tableRef.current) return;
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
    const printContent = `
        <html>
        <head>
            <title>Payment Transaction Report</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
                @page { size: A4; margin: 1.5cm; }
                tr { page-break-inside: avoid !important; }
                thead { display: table-header-group !important; }
                table { border-collapse: collapse; }
            </style>
        </head>
        <body class="bg-white">
            <div class="mx-auto">
                <header class="flex justify-between items-start pb-4 border-b-2 border-gray-800">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Payment Report</h1>
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
                <section class="grid grid-cols-3 gap-4 my-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p class="text-sm font-medium text-blue-800">Total Transactions</p>
                        <p class="text-2xl font-bold text-blue-900">${
                          reportSummary.totalTransactions
                        }</p>
                    </div>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p class="text-sm font-medium text-green-800">Total Revenue (Paid)</p>
                        <p class="text-2xl font-bold text-green-900">${formatCurrency(
                          reportSummary.totalRevenue
                        )}</p>
                    </div>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p class="text-sm font-medium text-yellow-800">Filter Period</p>
                        <p class="text-lg font-bold text-yellow-900">${formatDate(
                          dateRange.from
                        )} &mdash; ${formatDate(dateRange.to)}</p>
                    </div>
                </section>
                <main><div class="overflow-x-auto">${
                  tableRef.current.outerHTML
                }</div></main>
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

  const columns: Column<IPaymentReportItem>[] = [
    { header: 'Transaction ID', accessor: 'id', cellClassName: 'font-mono text-gray-700' },
    { header: 'Date', accessor: (item:IPaymentReportItem) => new Date(item.payment_date ?? item.created_at).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric'}), cellClassName: 'text-gray-600' },
    { header: 'Customer', accessor: 'userId', cellClassName: 'text-gray-600' },
    { header: 'Amount', accessor: (item:IPaymentReportItem) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(item.total_amount)), className: 'text-right', cellClassName: 'text-gray-800 text-right font-semibold' },
    { header: 'Status', accessor: (item:IPaymentReportItem) => <StatusBadge status={item.payment_status} />, className: 'text-center', cellClassName: 'text-center' },
  ];

  const availableYears = useMemo(
    () => Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i),
    []
  );
  const availableMonths = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString("default", { month: "long" }),
      })),
    []
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Transaction Report
          </h1>
          <p className="text-md text-gray-600 mt-1">
            Review, filter, and print all payment transactions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={<Hash size={20} />}
            title="Total Transactions"
            value={reportSummary.totalTransactions}
            color="blue"
          />
          <StatCard
            icon={<DollarSign size={20} />}
            title="Total Revenue (Paid)"
            value={new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(reportSummary.totalRevenue)}
            color="green"
          />
          <StatCard
            icon={<Users size={20} />}
            title="Unique Customers"
            value={reportSummary.uniqueCustomers}
            color="yellow"
          />
        </div>

        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
            <div className="xl:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <EnhancedDatePicker
                date={dateRange}
                onDateChange={handleDateRangeChange}
              />
            </div>
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Payment_Status | "")
                }
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 capitalize transition-all"
              >
                <option value="">All Statuses</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
            <div className="flex gap-2">
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
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            >
              <X className="w-4 h-4 mr-2" /> Reset Filters
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 mr-2" /> Print Report
            </button>
          </div>
        </Card>

        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          error={error}
          tableRef={tableRef}
        />

        <footer className="text-center mt-6 text-sm text-gray-500">
          <p>
            Menampilkan {filteredData.length} dari{" "}
            {Array.isArray(transactions) ? transactions.length : 0} total
            transaksi.
          </p>
        </footer>
      </div>
    </div>
  );
}
