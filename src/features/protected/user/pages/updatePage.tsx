import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import {  User, Pencil } from "lucide-react";
import UpdateUserForm from "../components/UpdateForm";

export default function UpdatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          { title: "User", href: "/data-user", icon: <User className="h-4 w-4" /> },
          {
            title: "Update",
            href: "/users",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <UpdateUserForm />
    </div>
  );
}
