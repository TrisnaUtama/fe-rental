import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import {  CarFrontIcon, Pencil } from "lucide-react";
import UpdateVehicleForm from "../components/UpdateForm";

export default function UpdatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          { title: "Vehicle", href: "/data-vehicle", icon: <CarFrontIcon className="h-4 w-4" /> },
          {
            title: "Update",
            href: "/vehicle",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <UpdateVehicleForm />
    </div>
  );
}
