import { useState, useRef, useMemo, forwardRef } from "react";
import { Printer, X, DollarSign, Undo2, TrendingUp, AlertCircle } from "lucide-react";
import { useFinancialSummary, usePromoUsageReport } from '../../hooks/useReport';
import { DataTable, type Column } from "../reports/DataTable";
import { EnhancedDatePicker } from "../ui/EnchantedDatePicker";
import type { DateRange } from "../../types/report";

interface IPromoUsageReportItem {
    code: string;
    usageCount: number;
    totalDiscountValue: number;
}

interface IPromoUsageReport {
    [promoId: string]: IPromoUsageReportItem;
}

interface IFinancialSummary {
  totalPaidAmount: number;
  totalRefundedAmount: number;
  netRevenue: number;
  paymentsByMethod: { [key: string]: number };
  promoImpact: { [key: string]: { totalDiscount: number; usageCount: number } };
}

const formatDate = (date: Date | null) =>
  date
    ? new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "...";

interface IPromoImpactItem {
    id: string;
    code?: string;
    totalDiscountValue?: number;
    usageCount?: number;
}

const Card: React.FC<{className?: string, children: React.ReactNode, ref?: React.Ref<HTMLDivElement>}> = forwardRef(({ className, children }, ref) => (
  <div ref={ref} className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
));

const StatCard = ({ icon, title, value, color = "blue" }: { icon: React.ReactNode, title: string, value: string | number, color?: string }) => {
    const colorClasses: { [key: string]: { bg: string, text: string } } = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
        red: { bg: 'bg-red-100', text: 'text-red-600' },
    };
    const selectedColor = colorClasses[color] || colorClasses.blue;
    return (
        <Card className="p-5">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${selectedColor.bg} ${selectedColor.text}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

export default function FinancialSummaryReport() {
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
    { value: "1", label: "January" }, { value: "2", label: "February" },
    { value: "3", label: "March" }, { value: "4", label: "April" },
    { value: "5", label: "May" }, { value: "6", label: "June" },
    { value: "7", label: "July" }, { value: "8", label: "August" },
    { value: "9", label: "September" }, { value: "10", label: "October" },
    { value: "11", label: "November" }, { value: "12", label: "December" },
  ], []);

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));
  }, []);

  const queryDateRange = useMemo(() => {
    let from: Date | null = null;
    let to: Date | null = null;

    if (month || year) {
        const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();
        if (month) {
            const selectedMonthInt = parseInt(month, 10) - 1;
            from = new Date(targetYear, selectedMonthInt, 1);
            to = new Date(targetYear, selectedMonthInt + 1, 0);
        } else { // Hanya tahun yang dipilih
            from = new Date(targetYear, 0, 1);
            to = new Date(targetYear, 11, 31);
        }
    } else {
        from = dateRange.from;
        to = dateRange.to;
    }

    if (from) from.setHours(0, 0, 0, 0);
    if (to) to.setHours(23, 59, 59, 999);

    return { from, to };
  }, [dateRange, month, year]);

  const {
    data: financialSummaryResponse,
    isLoading: isFinancialSummaryLoading,
    error: financialSummaryError,
  } = useFinancialSummary({
      startDate: queryDateRange.from ?? undefined,
      endDate: queryDateRange.to ?? undefined,
  });

  const {
    data: promoUsageReportResponse,
    isLoading: isPromoUsageReportLoading,
    error: promoUsageReportError,
  } = usePromoUsageReport(
    queryDateRange.from!,
    queryDateRange.to!
  );

  const summary: IFinancialSummary | null | undefined = financialSummaryResponse?.data;
  const promoUsage: IPromoUsageReport | null | undefined = promoUsageReportResponse?.data;

  const promoData: IPromoImpactItem[] = useMemo(() => {
    if (!promoUsage) return [];
    return Object.entries(promoUsage).map(([id, data]) => ({ id, code: data.code, usageCount: data.usageCount, totalDiscountValue: data.totalDiscountValue }));
  }, [promoUsage]);

  const paymentMethodData = useMemo(() => {
    if (!summary || !summary.paymentsByMethod) return [];
    return Object.entries(summary.paymentsByMethod).map(([method, amount]) => ({
      id: method,
      method: method.replace(/_/g, ' '),
      amount,
    }));
  }, [summary]);

  const resetDefaultDateRange = () => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    setDateRange({ from, to });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    if (newMonth) {
      setDateRange({ from: null, to: null });
    } else if (!year) {
        resetDefaultDateRange();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    if (newYear) {
      setDateRange({ from: null, to: null });
    } else if (!month) {
        resetDefaultDateRange();
    }
  };

  const resetFilters = () => {
    setMonth("");
    setYear("");
    resetDefaultDateRange();
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

  const handlePrint = () => {
    if (!printRef.current || !summary) return;

    const printContent = `
        <html>
        <head>
            <title>Financial Summary Report</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
                @page { size: A4; margin: 1.5cm; }
                .no-print { display: none !important; }
                tr { page-break-inside: avoid !important; }
                thead { display: table-header-group !important; }
                table { border-collapse: collapse; }
                .print-container {
                    border: 1px solid #e5e7eb;
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                }
            </style>
        </head>
        <body class="bg-white">
            <div class="mx-auto">
                <header class="flex justify-between items-start pb-4 border-b-2 border-gray-800">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Financial Summary</h1>
                        <p class="text-sm text-gray-600">Generated on: ${new Date().toLocaleString( "id-ID", { dateStyle: "full", timeStyle: "short" })}</p>
                    </div>
                    <div class="text-right">
                        <h2 class="text-lg font-semibold text-gray-800">Your Company Name</h2>
                        <p class="text-xs text-gray-500">Jl. Jenderal Sudirman No. 123, Jakarta</p>
                    </div>
                </header>
                <section class="grid grid-cols-3 gap-4 my-6">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p class="text-sm font-medium text-green-800">Total Paid</p>
                        <p class="text-2xl font-bold text-green-900">${formatCurrency(summary.totalPaidAmount)}</p>
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p class="text-sm font-medium text-blue-800">Net Revenue</p>
                        <p class="text-2xl font-bold text-blue-900">${formatCurrency(summary.netRevenue)}</p>
                    </div>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p class="text-sm font-medium text-yellow-800">Filter Period</p>
                        <p class="text-lg font-bold text-yellow-900">${formatDate(queryDateRange.from)} &mdash; ${formatDate(queryDateRange.to)}</p>
                    </div>
                </section>
                <main>${printRef.current.innerHTML}</main>
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

  const promoColumns: Column<IPromoImpactItem>[] = [
    { header: 'Promo Code', accessor: 'code', cellClassName: 'font-mono text-gray-700 font-semibold' },
    { header: 'Times Used', accessor: 'usageCount', className: 'text-center', cellClassName: 'text-center text-gray-600' },
  ];

  const paymentMethodColumns: Column<{ id: string; method: string; amount: number }>[] = [
    {
      header: 'Payment Method',
      accessor: 'method',
      cellClassName: 'capitalize font-medium text-gray-800'
    },
    {
      header: 'Total Amount',
      accessor: (item) => formatCurrency(item.amount),
      className: 'text-right',
      cellClassName: 'text-right font-mono'
    },
  ];

  const totalRevenueForChart = summary ? Object.values(summary.paymentsByMethod).reduce((a, b) => a + b, 0) : 0;

  const isLoading = isFinancialSummaryLoading || isPromoUsageReportLoading;
  const error = financialSummaryError || promoUsageReportError;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Financial Summary</h1>
                <p className="text-md text-gray-600 mt-1">An overview of revenue, refunds, and promo impact.</p>
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
                  disabled={isLoading || !summary || !promoUsage}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    <Printer className="w-4 h-4 mr-2" /> Print Report
                </button>
            </div>
        </header>

        <Card className="p-4 mb-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex-grow">
              <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select id="month-filter" value={month} onChange={handleMonthChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option value="">Any</option>
                {availableMonths.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
              </select>
            </div>
            <div className="flex-grow">
              <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select id="year-filter" value={year} onChange={handleYearChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                <option value="">Any</option>
                {availableYears.map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Or Select Date Range</label>
              <EnhancedDatePicker date={dateRange} onDateChange={setDateRange} disabled={!!month || !!year} />
            </div>
          </div>
        </Card>

        {isLoading ? (
            <div className="text-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Financial Data...</p>
            </div>
        ) : error ? (
            <Card className="p-8 text-center bg-red-50 text-red-700">
                <AlertCircle className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-lg font-semibold">Could Not Load Summary</h3>
                <p className="mt-1 text-sm">{error.message}</p>
            </Card>
        ) : (summary && promoUsage) ? (
          <div ref={printRef}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard icon={<TrendingUp size={22} />} title="Total Paid" value={formatCurrency(summary.totalPaidAmount)} color="green" />
                <StatCard icon={<Undo2 size={22} />} title="Total Refunded" value={formatCurrency(summary.totalRefundedAmount)} color="yellow"/>
                <StatCard icon={<DollarSign size={22} />} title="Net Revenue" value={formatCurrency(summary.netRevenue)} color="blue"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Revenue by Payment Method</h2>
                    <div className="space-y-4">
                        {Object.entries(summary.paymentsByMethod).length > 0 ? (
                            Object.entries(summary.paymentsByMethod).map(([method, amount]) => (
                                <div key={method}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-600 capitalize">{method.replace(/_/g, ' ').toLowerCase()}</span>
                                        <span className="text-sm font-bold text-gray-800">{formatCurrency(amount)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${totalRevenueForChart > 0 ? (amount / totalRevenueForChart) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No payment data available for this period.</p>
                        )}
                    </div>
                </Card>
                <Card className="lg:col-span-2 p-0 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-800">Promo Code Impact</h2>
                    </div>
                    {promoData.length > 0 ? (
                      <DataTable columns={promoColumns} data={promoData} isLoading={false} error={undefined} tableRef={null} />
                    ) : (
                      <p className="text-sm text-gray-500 p-6 text-center">No promo usage data for this period.</p>
                    )}
                </Card>
            </div>

            <div className="mt-8">
              <Card className="overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-bold text-gray-800">Payment Method Breakdown</h2>
                  <p className="text-sm text-gray-500 mt-1">Total revenue from each payment method in table format.</p>
                </div>
                <DataTable
                  columns={paymentMethodColumns}
                  data={paymentMethodData}
                  isLoading={isFinancialSummaryLoading}
                  error={financialSummaryError}
                  tableRef={null}
                />
              </Card>
            </div>

          </div>
        ) : (
          <Card className="p-12 text-center text-gray-500">
            <DollarSign className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Data Available
            </h3>
            <p>
              No financial data available for the selected date range.
            </p>
            <p className="text-sm mt-2">
              Try selecting a different date range.
            </p>
          </Card>
        )}

        <footer className="text-center mt-6 text-sm text-gray-500 no-print">
          <p>
            Report period: {queryDateRange.from ? formatDate(queryDateRange.from) : '...'} —{" "}
            {queryDateRange.to ? formatDate(queryDateRange.to) : '...'}
          </p>
        </footer>
      </div>
    </div>
  );
}