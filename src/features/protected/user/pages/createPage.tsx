import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import CreateUserForm from "../components/CreateForm";
import {  User, Pencil } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          { title: "User", href: "/data-user", icon: <User className="h-4 w-4" /> },
          {
            title: "Create",
            href: "/users",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <CreateUserForm />
    </div>
  );
}
