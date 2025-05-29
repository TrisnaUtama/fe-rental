import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import {  TreeDeciduous, Pencil } from "lucide-react";
import UpdateDestinationForm from "../components/UpdateForm";

export default function UpdatePage() {
  return (
    <div className="space-y-4 mx-24">
      <Breadcrumbs
        items={[
          { title: "User", href: "/data-destination", icon: <TreeDeciduous className="h-4 w-4" /> },
          {
            title: "Update",
            href: "/destinations",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <UpdateDestinationForm />
    </div>
  );
}
