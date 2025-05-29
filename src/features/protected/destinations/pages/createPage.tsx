import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import CreateDestinationForm from "../components/CreateForm";
import { TreePalm, Pencil } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="space-y-4 mx-40">
      <Breadcrumbs
        items={[
          {
            title: "Destination",
            href: "/data-destination",
            icon: <TreePalm className="h-4 w-4" />,
          },
          {
            title: "Create",
            href: "/users",
            icon: <Pencil className="h-4 w-4" />,
          },
        ]}
      />
      <CreateDestinationForm />
    </div>
  );
}
