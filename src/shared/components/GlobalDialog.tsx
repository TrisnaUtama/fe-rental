import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui/alert-dialog";
import { closeDialog } from "@/store/slice/confiramtionDialog";

import { callConfirmCallback } from "@/lib/confirmDialogCallback";

export function GlobalConfirmDialog() {
  const dispatch = useDispatch();
  const { open, title, description } = useSelector(
    (state: RootState) => state.confirmDialog
  );

  const handleConfirm = () => {
    callConfirmCallback(); 
    dispatch(closeDialog());
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && dispatch(closeDialog())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => dispatch(closeDialog())}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

