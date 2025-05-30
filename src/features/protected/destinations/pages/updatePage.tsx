import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import {  Pencil, PlaneIcon } from "lucide-react";
import UpdatetravelPackForm from "../components/UpdateForm";

export default function UpdatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          {
            title: "Travel Package",
            href: "/data-travel-pack",
            icon: <PlaneIcon className="h-4 w-4" />,
          },
          {
            title: "Update",
            href: "/travel-pack",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <UpdatetravelPackForm />
    </div>
  );
}
