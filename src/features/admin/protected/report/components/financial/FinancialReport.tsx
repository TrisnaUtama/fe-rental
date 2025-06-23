import { useState, useRef, useMemo, forwardRef } from "react";
import { Printer, X, DollarSign, Undo2, TrendingUp, AlertCircle, CalendarDays } from "lucide-react";
import { useFinancialSummary, usePromoUsageReport, useMonthlyFinancialSummary } from '../../hooks/useReport';
import { DataTable, type Column } from "../reports/DataTable";
import { EnhancedDatePicker } from "../ui/EnchantedDatePicker";
import type { DateRange, IMonthlyFinancialSummaryItem } from "../../types/report"; 

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
  const monthlyTableRef = useRef<HTMLDivElement>(null); 

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
        } else {
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

  // --- PERUBAHAN BARU: Logika untuk menentukan apakah dan kapan tabel bulanan harus ditampilkan ---
  const isDateRangeLongEnough = useMemo(() => {
    const { from, to } = queryDateRange;
    if (!from || !to || month || year) return false;
    // Anggap "lebih dari sebulan" jika durasinya lebih dari 31 hari
    const approxOneMonthInMillis = 31 * 24 * 60 * 60 * 1000;
    return (to.getTime() - from.getTime()) > approxOneMonthInMillis;
  }, [queryDateRange, month, year]);

  const monthlySummaryYear = useMemo(() => {
    // Kondisi 1: Filter tahun aktif (tanpa bulan)
    if (year && !month) {
      return year;
    }
    // Kondisi 2: Filter rentang tanggal yang panjang aktif
    if (isDateRangeLongEnough && queryDateRange.from) {
      // Menampilkan rincian untuk tahun dari tanggal mulai
      return String(queryDateRange.from.getFullYear());
    }
    return undefined; // Jangan tampilkan jika kondisi tidak terpenuhi
  }, [year, month, isDateRangeLongEnough, queryDateRange.from]);

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
  
  // --- PERUBAHAN BARU: Hook dipanggil berdasarkan logika 'monthlySummaryYear' ---
  const { 
    data: monthlySummaryResponse, 
    isLoading: isMonthlySummaryLoading, 
    error: monthlySummaryError 
  } = useMonthlyFinancialSummary(monthlySummaryYear);

  const summary: IFinancialSummary | null | undefined = financialSummaryResponse?.data;
  const promoUsage: IPromoUsageReport | null | undefined = promoUsageReportResponse?.data;
  const monthlySummaryData: IMonthlyFinancialSummaryItem[] = 
  monthlySummaryResponse?.data.map((item) => ({
    ...item,
    id: `${item.monthIndex}-${item.month}`, 
  })) || [];

  const promoData: IPromoImpactItem[] = useMemo(() => {
    if (!promoUsage) return [];
    return Object.entries(promoUsage).map(([id, data]) => ({ id, code: data.code, usageCount: data.usageCount, totalDiscountValue: data.totalDiscountValue }));
  }, [promoUsage]);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

  const monthlySummaryColumns: Column<IMonthlyFinancialSummaryItem>[] = [
    { header: 'Month', accessor: 'month', cellClassName: 'font-semibold text-gray-800' },
    { 
      header: 'Total Paid', 
      accessor: (item) => formatCurrency(item.totalPaidAmount), 
      className: 'text-right', 
      cellClassName: 'text-right font-mono text-green-700' 
    },
    { 
      header: 'Total Refunded', 
      accessor: (item) => formatCurrency(item.totalRefundedAmount), 
      className: 'text-right', 
      cellClassName: 'text-right font-mono text-yellow-700' 
    },
    { 
      header: 'Net Revenue', 
      accessor: (item) => formatCurrency(item.netRevenue), 
      className: 'text-right', 
      cellClassName: 'text-right font-mono font-bold text-blue-700' 
    },
  ];
  
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
  
  const handlePrint = () => {
    if (!printRef.current || !summary) return;

    const reportPeriodString = `${formatDate(
      queryDateRange.from
    )} - ${formatDate(queryDateRange.to)}`;
    
    const mainContentClone = printRef.current.cloneNode(true) as HTMLElement;
    const mainContentHtml = mainContentClone.innerHTML;

    let monthlyTableHtml = '';
    if (monthlyTableRef.current) {
        const monthlyTableClone = monthlyTableRef.current.cloneNode(true) as HTMLElement;
        monthlyTableHtml = monthlyTableClone.outerHTML;
    }

    const printWindow = window.open("", "", "height=800,width=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Financial Summary Report</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              body { 
                font-family: 'Inter', sans-serif; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
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
                padding: 0.5rem 0.75rem;
                border: 1px solid #e5e7eb; 
                text-align: left; 
                font-size: 0.8rem;
                word-break: break-word;
              } 
              thead { 
                background-color: #f9fafb !important; 
                display: table-header-group !important;
              } 
              tr { page-break-inside: avoid !important; }
              .shadow-sm, .shadow-md, .shadow-lg { box-shadow: none !important; }
              .bg-white { background-color: #fff !important; }
              .bg-blue-100, .bg-green-100, .bg-yellow-100, .bg-red-100, .bg-blue-600 {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            </style>
          </head>
          <body class="bg-white">
            <div class="mx-auto">
              <header class="flex justify-between items-start pb-4 border-b-2 border-gray-800 mb-6">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900">Financial Summary Report</h1>
                  <p class="text-sm text-gray-600">Period: ${reportPeriodString}</p>
                  <p class="text-sm text-gray-600 mt-1">Generated on: ${new Date().toLocaleString(
                    "id-ID",
                    { dateStyle: "full", timeStyle: "short" }
                  )}</p>
                </div>
                <div class="text-right">
                  <h2 class="text-lg font-semibold text-gray-800">Your Company Name</h2>
                  <p class="text-xs text-gray-500">Your Company Address</p>
                </div>
              </header>
              <main class="mt-6">
                ${mainContentHtml}
                ${monthlyTableHtml}
              </main>
              <footer class="text-center text-xs text-gray-400 mt-8 pt-4 border-t">
                <p>Confidential &copy; ${new Date().getFullYear()} Your Company Name</p>
              </footer>
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

  const promoColumns: Column<IPromoImpactItem>[] = [
    { header: 'Promo Code', accessor: 'code', cellClassName: 'font-mono text-gray-700 font-semibold' },
    { header: 'Times Used', accessor: 'usageCount', className: 'text-center', cellClassName: 'text-center text-gray-600' },
  ];

  const totalRevenueForChart = summary ? Object.values(summary.paymentsByMethod).reduce((a, b) => a + b, 0) : 0;
  
  const isLoading = isFinancialSummaryLoading || isPromoUsageReportLoading || (!!monthlySummaryYear && isMonthlySummaryLoading);
  const error = financialSummaryError || promoUsageReportError || (!!monthlySummaryYear && monthlySummaryError);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans bg-gray-50">
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
          <>
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
            </div>

            {/* --- PERUBAHAN BARU: Kondisi render diubah menjadi 'monthlySummaryYear' --- */}
            {monthlySummaryYear && (
              <div className="mt-8" ref={monthlyTableRef}> 
                <Card className="overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Monthly Breakdown for {monthlySummaryYear}</h2>
                    <p className="text-sm text-gray-500 mt-1">A summary of financial activity for each month in the selected year.</p>
                  </div>
                  {monthlySummaryData && monthlySummaryData.length > 0 ? (
                    <DataTable
                      columns={monthlySummaryColumns}
                      data={monthlySummaryData}
                      isLoading={isMonthlySummaryLoading}
                      error={monthlySummaryError}
                      tableRef={null}
                    />
                  ) : (
                     <div className="p-8 text-center">
                        <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-gray-500">No monthly financial data found for {monthlySummaryYear}.</p>
                     </div>
                  )}
                </Card>
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 text-center text-gray-500">
            <DollarSign className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p>No financial data available for the selected date range.</p>
            <p className="text-sm mt-2">Try selecting a different date range.</p>
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