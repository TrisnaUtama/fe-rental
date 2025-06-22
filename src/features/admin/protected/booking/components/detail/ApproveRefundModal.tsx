import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Upload } from "lucide-react";
import { useUploadImage } from "@/shared/hooks/useStorage";
import type { RefundResponse } from "../../types/booking.type";

interface ApproveRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  refund: RefundResponse;
  onConfirm: (payload: {
    admin_notes?: string;
    transfer_proof: string;
  }) => void;
  isProcessing: boolean;
}

export function ApproveRefundModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing
}: ApproveRefundModalProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleApprove = async () => {
    if (!proofFile) {
      toast.error("Please upload proof of transfer.");
      return;
    }
    try {
      const uploadResponse = await uploadImage(proofFile);
      const imageUrl = uploadResponse.data.url;
      onConfirm({
        admin_notes: adminNotes,
        transfer_proof: imageUrl,
      });
    } catch (error) {
      toast.error(`Failed to upload proof. Please try again. ${error}`);
    }
  };

  const isButtonDisabled = isUploading || isProcessing;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve & Process Refund</DialogTitle>
          <DialogDescription>
            Upload proof of transfer and add any relevant notes for this refund.
            This action is final.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
            <Textarea
              id="adminNotes"
              placeholder="e.g., Transfer processed via BCA Virtual Account."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transferProof">
              Proof of Transfer <span className="text-red-500">*</span>
            </Label>
            <div
              onClick={() => document.getElementById("transferProof")?.click()}
              className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer hover:bg-gray-50"
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload transfer receipt
                </p>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-4 max-h-40 rounded-md mx-auto"
                  />
                )}
                {proofFile && !previewUrl && (
                  <p className="text-xs text-gray-500">{proofFile.name}</p>
                )}
              </div>
            </div>
            <input
              id="transferProof"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isButtonDisabled}
          >
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isButtonDisabled}>
            {isUploading
              ? "Uploading..."
              : isProcessing
              ? "Processing..."
              : "Confirm Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}