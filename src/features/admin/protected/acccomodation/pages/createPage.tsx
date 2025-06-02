import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import CreateAccomodationForm from "../components/CreateForm";
import {  Pencil, HotelIcon } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          {
            title: "Accomodation",
            href: "/staff/data-accomodation",
            icon: <HotelIcon className="h-4 w-4" />,
          },
          {
            title: "Create",
            href: "/staff/accomodation",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <CreateAccomodationForm />
    </div>
  );
}
