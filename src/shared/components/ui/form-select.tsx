import { Label } from "./label";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface FormSelectProps {
  name: string;
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  options: {
    label: string;
    value: string;
  }[];
  className?: string;
  disabled?: boolean;
}

export const FormSelect = ({
  name,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  options,
  className,
  disabled = false,
}: FormSelectProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="h-4 w-4" />}
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      </div>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled} 
        className={cn(
          "mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900",
          disabled && "bg-gray-100 cursor-not-allowed text-gray-500",
          className
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
};