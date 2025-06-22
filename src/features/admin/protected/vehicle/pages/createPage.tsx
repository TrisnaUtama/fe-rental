import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import CreateVehicleForm from "../components/CreateForm";
import { CarFrontIcon, Pencil } from "lucide-react";

export default function CreatePromoPageCreatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          {
            title: "Vehicle",
            href: "/staff/data-vehicle",
            icon: <CarFrontIcon className="h-4 w-4" />,
          },
          {
            title: "Create",
            href: "/staff/vehicle",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <CreateVehicleForm />
    </div>
  );
}
