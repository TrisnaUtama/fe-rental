import React, { useState, useMemo, forwardRef, type ReactNode, type FC } from "react";
import {
  useFinancialSummary,
  usePaymentTransactionsReport,
  useRefundRequestsReport,
  usePromoUsageReport,
} from "@/features/admin/protected/report/hooks/useReport";
import type {  
    DateRange, 
    IPaymentReportItem,
    IPromoUsageReport,
} from "@/features/admin/protected/report/types/report";
import { AlertCircle, Loader2, TrendingUp, DollarSign, Tag, Wallet, ArrowLeftRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion, type Variants } from "framer-motion";

const Card = forwardRef<HTMLDivElement, { className?: string; children: ReactNode }>(
  ({ className, children }, ref) => (
    <div ref={ref} className={`rounded-2xl border bg-white text-gray-900 shadow-sm transition-all hover:shadow-lg ${className}`}>{children}</div>
  )
);
Card.displayName = "Card";

const CardHeader: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const StatCard: FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
}> = ({ title, value, icon: Icon, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <Icon className="w-5 h-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};


const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
}).format(value);

const formatDateShort = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

function FinancialSummaryCards({ dateRange }: { dateRange: DateRange }) {
    const { data: summaryData, isLoading, isError } = useFinancialSummary({
        startDate: dateRange.from!,
        endDate: dateRange.to!,
    });
    
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex-row items-center justify-between pb-2"><div className="h-5 bg-gray-200 rounded w-1/2"></div></CardHeader>
                        <CardContent><div className="h-8 bg-gray-300 rounded w-1/4"></div></CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const summary = summaryData?.data;
    
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard 
                title="Total Revenue"
                value={isError ? 'Error' : formatCurrency(summary?.totalPaidAmount ?? 0)}
                icon={TrendingUp}
            />
            <StatCard 
                title="Total Refunds"
                value={isError ? 'Error' : formatCurrency(summary?.totalRefundedAmount ?? 0)}
                icon={ArrowLeftRight}
            />
            <StatCard 
                title="Net Revenue"
                value={isError ? 'Error' : formatCurrency(summary?.netRevenue ?? 0)}
                icon={DollarSign}
                className="bg-blue-50 border-blue-200"
            />
        </div>
    );
}

function DailyRevenueChart({ dateRange }: { dateRange: DateRange }) {
    const { data: paymentData, isLoading, isError } = usePaymentTransactionsReport({
        startDate: dateRange.from || undefined,
        endDate: dateRange.to || undefined,
    });
    
    const chartData = useMemo(() => {
        if (isLoading || isError || !paymentData?.data) {
            return [];
        }

        const dailyTotals: { [date: string]: number } = {};
        
        paymentData.data.forEach((payment: IPaymentReportItem) => {
            const date = new Date(payment.created_at).toISOString().split('T')[0]; 
            const amount = Number(payment.total_amount);

            if (dailyTotals[date]) {
                dailyTotals[date] += amount;
            } else {
                dailyTotals[date] = amount;
            }
        });
        
        return Object.entries(dailyTotals)
            .map(([date, totalRevenue]) => ({
                date,
                totalRevenue,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    }, [paymentData, isLoading, isError]);
    
    if (isLoading) {
      return <Card className="flex items-center justify-center p-6 min-h-[350px]"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></Card>;
    }
    if (isError) {
      return <Card className="flex items-center justify-center p-6 min-h-[350px] text-red-600"><AlertCircle className="h-8 w-8 mr-2" />Could not load revenue data.</Card>;
    }

    return(
        <Card>
            <CardHeader>
                <CardTitle>Daily Gross Revenue</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tickFormatter={formatDateShort} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis tickFormatter={(value) => `${formatCurrency(value as number / 1000)}k`} fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} formatter={(value) => formatCurrency(value as number)} />
                        <Line type="monotone" dataKey="totalRevenue" stroke="#3b82f6" strokeWidth={2} dot={false} name="Revenue"/>
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

function PendingRefundsTable({ dateRange }: { dateRange: DateRange }) {
    const { data, isLoading, isError } = useRefundRequestsReport({ status: "PENDING", startDate: dateRange.from!, endDate: dateRange.to! });

    if (isLoading) return <Card className="flex items-center justify-center p-6 min-h-[150px]"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></Card>;
    if (isError) return <Card className="flex items-center justify-center p-6 min-h-[150px] text-red-600"><AlertCircle className="h-6 w-6 mr-2" />Error loading refunds.</Card>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="w-5 h-5 text-yellow-600"/>Pending Refunds</CardTitle>
            </CardHeader>
            <CardContent>
                {(data?.data?.length ?? 0) > 0 ? (
                    <ul className="space-y-4">
                        {data!.data!.slice(0, 5).map((refund) => (
                            <li key={refund.id} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-800 truncate">Booking #{refund.booking_id.substring(0, 8).toUpperCase()}</p>
                                    <p className="text-xs text-gray-500">{new Date(refund.request_date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-sm font-semibold text-gray-900">{formatCurrency(refund.refund_amount)}</div>
                            </li>
                        ))}
                    </ul>
                ) : ( <p className="text-center text-gray-500 py-4">No pending refunds.</p> )}
            </CardContent>
        </Card>
    );
}

function PromoUsageList({ dateRange }: { dateRange: DateRange }) {
    const { data, isLoading, isError } = usePromoUsageReport(dateRange.from!, dateRange.to!);
    
    const promoList = useMemo(() => {
        if (isLoading || isError || !data?.data) return [];
        const dataArray = Object.values(data.data as IPromoUsageReport);
        dataArray.sort((a, b) => b.usageCount - a.usageCount);
        return dataArray;
    }, [data, isLoading, isError]);

    if (isLoading) return <Card className="flex items-center justify-center p-6 min-h-[150px]"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></Card>;
    if (isError) return <Card className="flex items-center justify-center p-6 min-h-[150px] text-red-600"><AlertCircle className="h-6 w-6 mr-2" />Error loading promos.</Card>;

    return(
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Tag className="w-5 h-5 text-purple-600"/>Promo Usage</CardTitle>
            </CardHeader>
            <CardContent>
                {promoList.length > 0 ? (
                    <ul className="space-y-4">
                        {promoList.slice(0, 5).map((promo) => (
                            <li key={promo.code} className="flex items-center justify-between gap-4">
                                <p className="text-sm font-medium text-gray-800 truncate">{promo.code}</p>
                                <div className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{promo.usageCount} time{promo.usageCount > 1 ? 's' : ''}</div>
                            </li>
                        ))}
                    </ul>
                ) : ( <p className="text-center text-gray-500 py-4">No promos used in this period.</p> )}
            </CardContent>
        </Card>
    );
}

export default function FinanceAdminDashboard() {
  const [dateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 29); 
    return { from, to };
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
            <motion.div variants={itemVariants}>
                <FinancialSummaryCards dateRange={dateRange} />
            </motion.div>

            <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" variants={itemVariants}>
                <div className="lg:col-span-2">
                    <DailyRevenueChart dateRange={dateRange} />
                </div>
                <div className="space-y-8">
                    <PendingRefundsTable dateRange={dateRange} />
                    <PromoUsageList dateRange={dateRange} />
                </div>
            </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
