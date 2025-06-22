import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import CreateTravelPackForm from "../components/CreateForm";
import {  Pencil, PlaneIcon } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          {
            title: "Promo",
            href: "/staff/data-promo",
            icon: <PlaneIcon className="h-4 w-4" />,
          },
          {
            title: "Create",
            href: "/staff/promo",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <CreateTravelPackForm />
    </div>
  );
}
