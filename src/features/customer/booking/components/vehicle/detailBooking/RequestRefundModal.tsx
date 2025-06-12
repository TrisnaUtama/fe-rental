import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Info } from "lucide-react";

import { useRequestRefund } from "../../../hooks/useBooking"; 
import { useAuthContext } from "@/shared/context/authContex";
import type { BookingResponse } from "../../../types/booking.type";

const REFUND_PERCENTAGE = 0.70; 
const TRANSFER_FEE = 5000; 

const formatRupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

interface RequestRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingResponse | null;
}

export function RequestRefundModal({ isOpen, onClose, booking }: RequestRefundModalProps) {
  const [reason, setReason] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  
  const { accessToken } = useAuthContext();
  
  const { mutateAsync: requestRefund, isPending } = useRequestRefund(accessToken || "");

  if (!isOpen || !booking) return null;
  const estimatedRefund = (Number(booking.total_price) * REFUND_PERCENTAGE) - TRANSFER_FEE;

  const handleSubmit = async () => {
    if (!reason || !bankName || !accountHolder || !accountNumber) {
        toast.error("Please fill in all required fields.");
        return;
    }
    try {
        const payload = { reason, bank_name: bankName, account_holder: accountHolder, account_number: accountNumber };
        
        await requestRefund({ bookingId: booking.id, data: payload });
        
        toast.success("Refund request submitted successfully! It is now awaiting admin approval.");
        onClose();
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        toast.error(`Failed to submit request: ${errorMessage}`);
    }
  };

  console.log(booking);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a Refund</DialogTitle>
          <DialogDescription>
            Submit your refund request for admin approval. Please read the terms below.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Refund Policy</AlertTitle>
            <AlertDescription>
              Refunds are processed at **{REFUND_PERCENTAGE * 100}%** of the total price, minus a transfer fee of **{formatRupiah(TRANSFER_FEE)}**. All requests must be approved by an administrator.
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-800">Estimated Refund Amount</p>
            <p className="text-2xl font-bold text-blue-600">{formatRupiah(estimatedRefund)}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund <span className="text-red-500">*</span></Label>
            <Textarea id="reason" placeholder="e.g., My travel plans have changed unexpectedly." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>

          <fieldset className="border p-4 rounded-lg space-y-4">
            <legend className="text-sm font-medium px-1">Bank Transfer Details</legend>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name <span className="text-red-500">*</span></Label>
                    <Input id="bankName" placeholder="e.g., BCA, Mandiri" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number <span className="text-red-500">*</span></Label>
                    <Input id="accountNumber" type="number" placeholder="1234567890" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                </div>
            </div>
            <div className="space-y-2">
                    <Label htmlFor="accountHolder">Account Holder Name <span className="text-red-500">*</span></Label>
                    <Input id="accountHolder" placeholder="Full name on the account" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />
                </div>
          </fieldset>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Refund Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}