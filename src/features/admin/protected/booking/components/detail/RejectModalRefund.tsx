import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import type { RefundResponse } from "../../types/booking.type";

interface RejectRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  refund: RefundResponse;
  onConfirm: (payload: { admin_notes: string }) => void;
  isProcessing: boolean;
}

export function RejectRefundModal({ isOpen, onClose, refund, onConfirm, isProcessing }: RejectRefundModalProps) {
  const [adminNotes, setAdminNotes] = useState("");

  const handleReject = () => {
    if (!adminNotes || adminNotes.trim() === '') {
      toast.error("A reason for rejection is required.");
      return;
    }
    onConfirm({
      admin_notes: adminNotes,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Refund Request</DialogTitle>
          <DialogDescription>
            Please provide a clear reason for rejecting this refund request. This reason will be recorded.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">You are about to reject the refund request for Booking ID: <strong>#{refund.booking_id.slice(-8)}</strong></p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Reason for Rejection <span className="text-red-500">*</span></Label>
            <Textarea 
                id="adminNotes" 
                placeholder="e.g., Refund request submitted less than 48 hours before booking start date, as per policy." 
                value={adminNotes} 
                onChange={(e) => setAdminNotes(e.target.value)} 
                rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
            {isProcessing ? 'Submitting...' : 'Confirm Rejection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}