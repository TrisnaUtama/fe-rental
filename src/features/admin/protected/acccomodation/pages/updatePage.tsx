import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import {  HotelIcon, Pencil} from "lucide-react";
import UpdatetravelPackForm from "../components/UpdateForm";

export default function UpdatePage() {
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
            title: "Update",
            href: "/staff/accomodationi",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <UpdatetravelPackForm />
    </div>
  );
}
