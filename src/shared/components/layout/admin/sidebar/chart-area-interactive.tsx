import React, { useState, useMemo, forwardRef } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import type { IDailyBusinessSummaryItem, DateRange } from "@/features/admin/protected/report/types/report";
import { useDailyBusinessSummary } from "@/features/admin/protected/report/hooks/useReport";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Card = forwardRef<HTMLDivElement, { className?: string, children: React.ReactNode }>(({ className, children }, ref) => (
  <div ref={ref} className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
));
Card.displayName = "Card";
const CardHeader: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);
const CardDescription: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);
const CardTitle: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Select: React.FC<{ value: string; onValueChange: (value: string) => void; children: React.ReactNode; className?: string }> = ({ value, onValueChange, children, className }) => (
  <select value={value} onChange={(e) => onValueChange(e.target.value)} className={`w-40 p-2 border rounded-lg bg-white dark:bg-gray-800 ${className}`}>
    {children}
  </select>
);
const SelectItem: React.FC<{ value: string; className?: string; children: React.ReactNode }> = ({ value, children, className }) => (
  <option value={value} className={`px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${className}`}>
    {children}
  </option>
);

interface ToggleGroupItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  dataState?: 'on' | 'off';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ToggleGroup: React.FC<{
  type: 'single';
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}> = ({ value, onValueChange, children, className = '' }) => (
  <div className={`flex rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement<ToggleGroupItemProps>(child)) {
        return React.cloneElement(child, {
          onClick: () => onValueChange(child.props.value),
          dataState: child.props.value === value ? 'on' : 'off',
        });
      }
      return child;
    })}
  </div>
);

const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  value,
  children,
  className = '',
  onClick,
  dataState = 'off'
}) => {
  const isActive = dataState === 'on';

  return (
    <button
      value={value}
      onClick={onClick}
      data-state={dataState}
      className={`px-2.5 h-8 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-50'
          : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${className}`}
    >
      {children}
    </button>
  );
};
const formatCurrencyChart = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact", 
    minimumFractionDigits: 0,
  }).format(value);

interface ChartConfig {
    [key: string]: {
      label: string;
      color?: string;
    };
}
const chartConfig = {
  totalBookings: {
    label: "Total Bookings",
    color: "hsl(var(--chart-1))", 
  },
  netRevenue: {
    label: "Net Revenue",
    color: "hsl(var(--chart-2))", 
  },
} satisfies ChartConfig;

export function BusinessSummaryChart() {
  const [timeRange, setTimeRange] = useState("30d"); 

  const queryDateRange = useMemo<DateRange>(() => {
    const to = new Date();
    const from = new Date(to);
    let daysToSubtract = 30; 

    if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    from.setDate(to.getDate() - daysToSubtract + 1); 
    to.setUTCHours(23, 59, 59, 999);
    from.setUTCHours(0, 0, 0, 0);

    return { from, to };
  }, [timeRange]);

  const {
    data: dailySummaryResponse,
    isLoading,
    error,
  } = useDailyBusinessSummary(queryDateRange.from!, queryDateRange.to!);
  const chartData: IDailyBusinessSummaryItem[] = dailySummaryResponse?.data || [];

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Business Trends</CardTitle>
          <CardDescription>Visualizing key business metrics over time.</CardDescription>
          <div className="absolute right-6 top-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px] sm:h-[350px]">
          <p className="text-gray-500">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Business Trends</CardTitle>
          <CardDescription>Visualizing key business metrics over time.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="mx-auto h-10 w-10 mb-3" />
          <p className="text-lg font-semibold">Error Loading Chart Data</p>
          <p className="text-sm mt-1">{error.message || "An unexpected error occurred."}</p>
        </CardContent>
      </Card>
    );
  }

  // Render actual chart
  return (
    <Card className="@container/card col-span-full">
      <CardHeader className="relative">
        <CardTitle>Business Trends</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Visualizing total bookings and net revenue over time.
          </span>
          <span className="@[540px]/card:hidden">Trends over time.</span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            className="hidden sm:flex" // Show on sm and up, hide on smaller
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange} className="flex sm:hidden"> {/* Show on small, hide on sm and up */}
            <SelectItem value="90d">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d">
              Last 7 days
            </SelectItem>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData} margin={{ left: -10, right: 20 }}>
              <defs>
                <linearGradient id="fillTotalBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillNetRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-2))"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  return value > 0 && chartConfig.netRevenue.label === 'Net Revenue'
                    ? formatCurrencyChart(value)
                    : value.toString();
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white p-2 text-sm shadow-md dark:bg-gray-800">
                        <p className="font-semibold text-gray-900 dark:text-gray-50">{new Date(label).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {chartConfig[entry.dataKey as keyof typeof chartConfig]?.label || entry.dataKey}:{" "}
                            {entry.dataKey === 'netRevenue' ? formatCurrencyChart(entry.value as number) : entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
                wrapperStyle={{ outline: "none" }}
              />
              <Area
                dataKey="netRevenue"
                type="natural"
                fill="url(#fillNetRevenue)"
                stroke="hsl(var(--chart-2))"
                stackId="a"
                name={chartConfig.netRevenue.label}
              />
              <Area
                dataKey="totalBookings"
                type="natural"
                fill="url(#fillTotalBookings)"
                stroke="hsl(var(--chart-1))"
                stackId="a"
                name={chartConfig.totalBookings.label}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] sm:h-[350px] text-gray-500">
            No chart data available for the selected period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
