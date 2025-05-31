import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import {  TreeDeciduous, Pencil } from "lucide-react";
import UpdateDestinationForm from "../components/UpdateForm";

export default function UpdatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          { title: "Travel Packages", href: "/data-travel-pacl", icon: <TreeDeciduous className="h-4 w-4" /> },
          {
            title: "Update",
            href: "/travel-pack",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <UpdateDestinationForm />
    </div>
  );
}
