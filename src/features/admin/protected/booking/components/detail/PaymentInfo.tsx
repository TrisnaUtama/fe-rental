import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Wallet, DollarSign, Info, Calendar } from "lucide-react";
import type { BookingResponse } from "../../types/booking.type";
import React from "react";
import { Badge } from "@/shared/components/ui/badge";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid Date";
  }
};
const formatRupiah = (value: string | number | null | undefined) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
const SpecItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <div className="text-xs text-gray-500 flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
    <div className="text-sm font-semibold text-gray-800 mt-1">{value}</div>
  </div>
);

export const PaymentInfo = ({ booking }: { booking: BookingResponse }) => (
    <Card className="rounded-2xl shadow-sm">
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Wallet className="w-5 h-5 text-blue-500"/>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            {booking.Payments && booking.Payments.length > 0 ? (
                <div className="space-y-4">
                    {booking.Payments.map((payment, index) => (
                        <div key={payment.id || index} className="border p-4 rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SpecItem icon={DollarSign} label="Amount Paid" value={formatRupiah(payment.total_amount)} />
                                <SpecItem
                  icon={Info}
                  label="Payment Status"
                  value={
                    <Badge
                      variant="outline"
                      className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 bg-gray-100 text-gray-700 border-gray-200"
                    >
                      {payment.payment_status}
                    </Badge>
                  }
                />
                                <SpecItem icon={Calendar} label="Payment Date" value={formatDate(payment.created_at)} />
                                {payment.payment_method && <SpecItem icon={Wallet} label="Payment Method" value={payment.payment_method} />}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (<p className="text-gray-500 text-center py-4">No payment information available.</p>)}
        </CardContent>
    </Card>
);
