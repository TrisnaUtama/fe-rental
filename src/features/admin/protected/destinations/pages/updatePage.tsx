import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import {  Pencil, TreePalm } from "lucide-react";
import UpdatetravelPackForm from "../components/UpdateForm";

export default function UpdatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          {
            title: "Destination",
            href: "/staff/data-destination",
            icon: <TreePalm className="h-4 w-4" />,
          },
          {
            title: "Update",
            href: "/staff/destination",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <UpdatetravelPackForm />
    </div>
  );
}
