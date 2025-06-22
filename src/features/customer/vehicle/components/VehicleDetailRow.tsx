import type { LucideIcon } from "lucide-react";

export function VehicleDetailRow({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string | number }) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-shrink-0 bg-gray-200 text-gray-600 p-2 rounded-full">
         <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="font-semibold text-gray-800 capitalize">{String(value)}</p>
      </div>
    </div>
  );
}
