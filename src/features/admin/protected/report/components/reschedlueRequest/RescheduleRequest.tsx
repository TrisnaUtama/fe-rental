import React, { useState, useRef, useMemo } from "react";
import { Printer, X, CheckCircle, Hash, Users } from "lucide-react";
import type { DateRange, IRescheduleRequestReportItem, RescheduleStatus } from "../../types/report";
import { useRescheduleRequestsReport } from "../../hooks/useReport";
import { DataTable, type Column } from "../reports/DataTable";
import { StatCard } from "../reports/StatCard";
import { Card } from "../ui/Card";
import { EnhancedDatePicker } from "../ui/EnchantedDatePicker";
import { RescheduleStatusBadge } from "../ui/ReshceduleStatusBadge";


export default function RescheduleRequestReport() {
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [status, setStatus] = useState<RescheduleStatus | "">("");
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
    data: reschedulesResponse,
    isLoading,
    error,
  } = useRescheduleRequestsReport({
    status: status || undefined,
    startDate: dateRange.from || undefined,
    endDate: queryEndDate,
  });
  
  const reschedules: IRescheduleRequestReportItem[] = reschedulesResponse?.data || [];
  
  const filteredData = useMemo(() => {
    if (!Array.isArray(reschedules)) return [];
    return reschedules.filter((r: IRescheduleRequestReportItem) => {
      const requestDate = new Date(r.new_start_date);
      if (month && requestDate.getUTCMonth() + 1 !== parseInt(month)) return false;
      if (year && requestDate.getUTCFullYear() !== parseInt(year)) return false;
      return true;
    });
  }, [reschedules, month, year]);

  const reportSummary = useMemo(() => {
      const totalRequests = filteredData.length;
      const approvedRequests = filteredData.filter(r => r.status === 'APPROVED').length;
      const pendingRequests = filteredData.filter(r => r.status === 'PENDING').length;
      return { totalRequests, approvedRequests, pendingRequests };
  }, [filteredData]);

  const handleDateRangeChange = (newDateRange: DateRange) => { setDateRange(newDateRange); if (newDateRange.from || newDateRange.to) { setMonth(""); setYear(""); }};
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const newMonth = e.target.value; setMonth(newMonth); if (newMonth) { setDateRange({ from: null, to: null }); }};
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const newYear = e.target.value; setYear(newYear); if (newYear) { setDateRange({ from: null, to: null }); }};
  const resetFilters = () => { setDateRange({ from: null, to: null }); setStatus(""); setMonth(""); setYear(""); };
  
  const handlePrint = () => {
    if (!tableRef.current) return;
    const printContent = `
        <html><head><title>Reschedule Request Report</title><script src="https://cdn.tailwindcss.com"></script><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; } @page { size: A4; margin: 1.5cm; } tr { page-break-inside: avoid !important; } thead { display: table-header-group !important; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left;} th { background-color: #f2f2f2; }</style></head>
        <body class="bg-white"><div class="mx-auto"><header class="flex justify-between items-start pb-4 border-b-2 border-gray-800"><div><h1 class="text-3xl font-bold text-gray-900">Reschedule Request Report</h1><p class="text-sm text-gray-600">Generated on: ${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p></div><div class="text-right"><h2 class="text-lg font-semibold text-gray-800">Your Company Name</h2><p class="text-xs text-gray-500">Jl. Jenderal Sudirman No. 123, Jakarta</p></div></header>
        <section class="grid grid-cols-3 gap-4 my-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><p class="text-sm font-medium text-blue-800">Total Requests</p><p class="text-2xl font-bold text-blue-900">${reportSummary.totalRequests}</p></div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4"><p class="text-sm font-medium text-green-800">Approved / Completed</p><p class="text-2xl font-bold text-green-900">${reportSummary.approvedRequests}</p></div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><p class="text-sm font-medium text-yellow-800">Pending Requests</p><p class="text-2xl font-bold text-yellow-900">${reportSummary.pendingRequests}</p></div>
        </section>
        <main><div class="overflow-x-auto">${tableRef.current.outerHTML}</div></main><footer class="text-center text-xs text-gray-400 mt-8 pt-4 border-t"><p>Confidential &copy; ${new Date().getFullYear()} Your Company Name</p></footer></div></body></html>`;
    const printWindow = window.open("", "", "height=800,width=1200");
    if (printWindow) { printWindow.document.write(printContent); printWindow.document.close(); printWindow.focus(); setTimeout(() => { printWindow.print(); printWindow.close(); }, 500); }
  };

  const columns: Column<IRescheduleRequestReportItem>[] = [
    { header: 'Request ID', accessor: 'id', cellClassName: 'font-mono text-gray-700' },
    { header: 'Booking ID', accessor: 'booking_id', cellClassName: 'font-mono text-gray-600' },
    { header: 'Request Date', accessor: (item) => new Date(item.new_end_date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric'}), cellClassName: 'text-gray-600' },
    { header: 'Old Schedule', accessor: (item) => new Date(item.booking.start_date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric'}), cellClassName: 'text-red-600 line-through' },
    { header: 'New Schedule', accessor: (item) => new Date(item.booking.end_date!).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric'}), cellClassName: 'text-green-600 font-semibold' },
    { header: 'Status', accessor: (item) => <RescheduleStatusBadge status={item.status} />, className: 'text-center', cellClassName: 'text-center' },
  ];

  const availableYears = useMemo(() => Array.from({length: 6}, (_, i) => new Date().getFullYear() - i), []);
  const availableMonths = useMemo(() => Array.from({length: 12}, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('default', { month: 'long' }) })), []);

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8"><h1 className="text-3xl font-bold text-gray-900">Reschedule Request Report</h1><p className="text-md text-gray-600 mt-1">Review, filter, and print all reschedule requests.</p></header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <StatCard icon={<Hash size={20} />} title="Total Requests" value={reportSummary.totalRequests} color="blue" />
            <StatCard icon={<CheckCircle size={20} />} title="Approved / Completed" value={reportSummary.approvedRequests} color="green" />
            <StatCard icon={<Users size={20} />} title="Pending Requests" value={reportSummary.pendingRequests} color="yellow" />
        </div>

        <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
                <div className="xl:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Request Date Range</label><EnhancedDatePicker date={dateRange} onDateChange={handleDateRangeChange} /></div>
                <div><label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="status-filter" value={status} onChange={(e) => setStatus(e.target.value as RescheduleStatus | "")} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 capitalize transition-all">
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
                <div className="flex gap-2"><div className="flex-grow"><label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-1">Month</label><select id="month-filter" value={month} onChange={handleMonthChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"><option value="">Any</option>{availableMonths.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div><div className="flex-grow"><label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">Year</label><select id="year-filter" value={year} onChange={handleYearChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"><option value="">Any</option>{availableYears.map((y) => <option key={y} value={y}>{y}</option>)}</select></div></div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 pt-4 border-t border-gray-200">
                <button onClick={resetFilters} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"><X className="w-4 h-4 mr-2" /> Reset Filters</button>
                <button onClick={handlePrint} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all"><Printer className="w-4 h-4 mr-2" /> Print Report</button>
            </div>
        </Card>

        <DataTable columns={columns} data={filteredData} isLoading={isLoading} error={error} tableRef={tableRef} />
        
        <footer className="text-center mt-6 text-sm text-gray-500"><p>Showing {filteredData.length} of {Array.isArray(reschedules) ? reschedules.length : 0} total reschedule requests.</p></footer>
      </div>
    </div>
  );
}
