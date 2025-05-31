import { Label } from "./label";
import { Input } from "./input";
import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const FormInput = ({
  label,
  icon: Icon,
  error,
  className,
  ...inputProps
}: FormInputProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="h-4 w-4" />}
        <Label htmlFor={inputProps.name} className="text-sm font-medium">
          {label}
        </Label>
      </div>
      <Input {...inputProps} className={className} />
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
};
