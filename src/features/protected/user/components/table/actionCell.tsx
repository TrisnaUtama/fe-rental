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
import { useDeleteUser } from "../../hooks/useUser";
import { toast } from "sonner";
import type { IUser } from "../../types/user.type";
import { setConfirmCallback } from "@/lib/confirmDialogCallback";

export function ActionsCell({ user }: { user: IUser }) {
  const dispatch = useDispatch();
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();
  const { mutate } = useDeleteUser(accessToken || "");

  const handleDeleteConfirm = () => {
    mutate(user.id || "", {
      onSuccess: () => {
        toast.success("User deleted successfully!");
        setTimeout(() => {
          navigate(0)
        }, 2000)
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
      description: "Are you sure you want to delete this user?",
    })
  );
};

  const handleEditClick = () => {
    if (!user.id) {
      toast.error("User ID is missing");
      return;
    }
    navigate(`/data-user/update/${user.id}`);
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
          <DropdownMenuItem disabled={!user.status} onClick={handleEditClick}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={!user.status} onClick={handleDeleteClick}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
