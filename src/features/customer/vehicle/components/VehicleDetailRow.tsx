import type { LucideIcon } from "lucide-react";

export function VehicleDetailRow({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string | number }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-500" /> {label}: <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}