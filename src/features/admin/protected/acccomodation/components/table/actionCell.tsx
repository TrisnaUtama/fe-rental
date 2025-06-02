import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { openDialog } from "@/store/slice/confiramtionDialog";
import { useAuthContext } from "@/shared/context/authContex";
import { useDeleteAccomodation } from "../../hooks/useAccomodation";
import { toast } from "sonner";
import type { IAccomodation } from "../../types/accomodation.type";
import { setConfirmCallback } from "@/lib/confirmDialogCallback";

export function ActionsCell({ destination }: { destination: IAccomodation }) {
  const dispatch = useDispatch();
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();
  const { mutate } = useDeleteAccomodation(accessToken || "");

  const handleDeleteConfirm = () => {
    mutate(destination.id || "", {
      onSuccess: () => {
        toast.success("Accomodation deleted successfully!");
        setTimeout(() => {
          navigate(0);
        }, 2000);
      },
      onError: (err: any) => {
        if (err?.errors && typeof err.errors === "object") {
          toast.error(err.error);
        } else {
          toast.error(err.message);
        }
      },
    });
  };

  const handleDeleteClick = () => {
    setConfirmCallback(handleDeleteConfirm);
    dispatch(
      openDialog({
        title: "Confirm Delete",
        description: "Are you sure you want to delete this accomodation?",
      })
    );
  };

  const handleEditClick = () => {
    if (!destination.id) {
      toast.error("User ID is missing");
      return;
    }
    navigate(`/staff/data-accomodation/update/${destination.id}`);
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!destination.status}
            onClick={handleDeleteClick}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
