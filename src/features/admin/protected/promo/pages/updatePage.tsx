import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { PlaneIcon, Pencil } from "lucide-react";
import UpdatePromoForm from "../components/UpdateForm";

export default function UpdatePage() {
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
            title: "Update",
            href: "/staff/promo",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <UpdatePromoForm />
    </div>
  );
}
