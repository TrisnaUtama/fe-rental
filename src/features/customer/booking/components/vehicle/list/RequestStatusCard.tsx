import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Hourglass, CheckCircle, XCircle, Banknote, Calendar, Landmark, User, Hash, FileText, Info, MessageSquare, ImageIcon } from "lucide-react";
import type { RefundResponse, RescheduleRequestResponse } from "../../../types/booking.type";

const formatRupiah = (value: string | number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));
const formatDisplayDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
  <div className="flex items-start">
    <Icon className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
    <div className="ml-3 flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

interface RequestStatusCardProps {
  request: RefundResponse | RescheduleRequestResponse;
  type: 'refund' | 'reschedule';
  originalBooking: { start_date: string, end_date: string | null };
}

export function RequestStatusCard({ request, type, originalBooking }: RequestStatusCardProps) {
  const isRefund = type === 'refund';
  const refundData = isRefund ? (request as RefundResponse) : null;
  const rescheduleData = !isRefund ? (request as RescheduleRequestResponse) : null;

  const statusConfig = {
    PENDING: { variant: 'pending', icon: Hourglass, title: `${isRefund ? 'Refund' : 'Reschedule'} Request Pending` },
    APPROVED: { variant: 'success', icon: CheckCircle, title: `${isRefund ? 'Refund' : 'Reschedule'} Approved` },
    COMPLETED: { variant: 'success', icon: CheckCircle, title: `${isRefund ? 'Refund' : 'Reschedule'} Complete` },
    REJECTED: { variant: 'rejected', icon: XCircle, title: `${isRefund ? 'Refund' : 'Reschedule'} Rejected` },
  };

  const currentStatusKey = request.status as keyof typeof statusConfig;
  const currentStatus = statusConfig[currentStatusKey] || { variant: 'info', icon: Info, title: 'Status Update' };

  return (
    <Card className={`rounded-2xl shadow-sm border-l-4 ${currentStatus.variant === 'pending' ? 'border-amber-400' : currentStatus.variant === 'success' ? 'border-green-500' : 'border-red-500'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-3 ${currentStatus.variant === 'pending' ? 'text-amber-800' : currentStatus.variant === 'success' ? 'text-green-800' : 'text-red-800'}`}>
          <currentStatus.icon className="w-6 h-6" />
          {currentStatus.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reschedule Details */}
        {rescheduleData && (
          <div className="grid sm:grid-cols-2 gap-4">
            <DetailRow icon={Calendar} label="Original Dates" value={`${formatDisplayDate(originalBooking.start_date)} - ${formatDisplayDate(originalBooking.end_date!)}`} />
            <DetailRow icon={Calendar} label="Requested Dates" value={`${formatDisplayDate(rescheduleData.new_start_date)} - ${formatDisplayDate(rescheduleData.new_end_date)}`} />
          </div>
        )}

        {/* Refund Details */}
        {refundData && (
          <div className="space-y-4">
            <DetailRow icon={Banknote} label="Requested Refund Amount" value={formatRupiah(refundData.refund_amount)} />
            <hr/>
            <h4 className="text-sm font-semibold text-gray-600">Your Bank Details</h4>
            <div className="grid sm:grid-cols-2 gap-4">
                <DetailRow icon={Landmark} label="Bank Name" value={refundData.bank_name} />
                <DetailRow icon={User} label="Account Holder" value={refundData.account_holder} />
                <DetailRow icon={Hash} label="Account Number" value={refundData.account_number} />
            </div>
             <DetailRow icon={FileText} label="Reason for Refund" value={<p className="italic">"{refundData.reason}"</p>} />
          </div>
        )}
        
        {/* --- START: Admin Response Section --- */}
        { (request.admin_notes || (refundData && refundData.transfer_proof)) && (
            <div className="pt-4 mt-4 border-t space-y-4">
                <h4 className="text-sm font-bold text-gray-700">Admin Response</h4>
                {request.admin_notes && (
                     <DetailRow 
                        icon={MessageSquare} 
                        label="Notes from Admin" 
                        value={<p className="italic text-gray-700">"{request.admin_notes}"</p>}
                    />
                )}
                {refundData?.transfer_proof && (
                    <div>
                        <DetailRow 
                            icon={ImageIcon} 
                            label="Proof of Transfer" 
                            value={
                                <a href={refundData.transfer_proof} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
                                    <img 
                                        src={refundData.transfer_proof} 
                                        alt="Proof of refund transfer" 
                                        className="rounded-lg w-full max-w-xs h-auto object-cover border-2 hover:opacity-90 transition-opacity"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </a>
                            }
                        />
                    </div>
                )}
            </div>
        )}
        {/* --- END: Admin Response Section --- */}
      </CardContent>
    </Card>
  );
}
