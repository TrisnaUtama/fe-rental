import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {  FileText, Landmark, User, Hash, Hourglass, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import type { RefundResponse } from "../../types/booking.type";

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div>
    <div className="text-xs text-gray-500 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" />{label}</div>
    <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
  </div>
);

const formatRupiah = (value: string | number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));

export const RefundRequestDetails = ({ refund }: { refund: RefundResponse }) => {
  const statusConfig = {
    PENDING: {
      variant: 'pending',
      icon: Hourglass,
      title: 'Pending Refund Request',
      borderColor: 'border-amber-400',
      textColor: 'text-amber-800',
    },
    APPROVED: {
      variant: 'success',
      icon: CheckCircle,
      title: 'Refund Approved & Processed',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
    },
    COMPLETED: {
        variant: 'success',
        icon: CheckCircle,
        title: 'Refund Complete',
        borderColor: 'border-green-500',
        textColor: 'text-green-800',
    },
    REJECTED: {
      variant: 'rejected',
      icon: XCircle,
      title: 'Refund Request Rejected',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
    },
  };

  const currentStatus = statusConfig[refund.status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Card className={`rounded-2xl shadow-sm border-l-4 ${currentStatus.borderColor}`}>
      <CardHeader>
        <CardTitle className={`text-xl font-bold flex items-center gap-3 ${currentStatus.textColor}`}>
          <currentStatus.icon className="w-6 h-6" />
          {currentStatus.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow icon={FileText} label="Customer's Reason" value={<p className="italic">"{refund.reason}"</p>} />
        
        {/* --- NEW: Conditionally show Admin Notes if they exist --- */}
        {refund.admin_notes && (
            <DetailRow icon={FileText} label="Admin Notes" value={<p className="font-normal">{refund.admin_notes}</p>} />
        )}

        <hr />
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Bank Transfer Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailRow icon={Landmark} label="Bank Name" value={refund.bank_name} />
            <DetailRow icon={User} label="Account Holder" value={refund.account_holder} />
            <DetailRow icon={Hash} label="Account Number" value={refund.account_number} />
          </div>
        </div>
        <hr />
        <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
            <span className="font-semibold text-gray-900">Refund Amount</span>
            <span className="font-bold text-lg text-gray-900">{formatRupiah(refund.refund_amount)}</span>
        </div>

        {/* --- NEW: Conditionally show link to transfer proof --- */}
        {refund.transfer_proof && (
            <div className="pt-2">
                <Button asChild variant="outline" size="sm">
                    <a href={refund.transfer_proof} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2"/>View Transfer Proof
                    </a>
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};