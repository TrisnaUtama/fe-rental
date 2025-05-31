import type { LucideIcon } from "lucide-react";
import React from "react";

interface FormTextareaProps {
  name: string;
  label: string;
  icon?: LucideIcon
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
  maxLength?: number;
}

export const FormTextarea = ({
  name,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  maxLength,
}: FormTextareaProps) => {
  return (
    <div>
      <label className="flex items-center gap-2 mb-1" htmlFor={name}>
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-sm font-medium">{label}</span>
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full rounded-md border px-3 py-2 resize-y focus:outline-none focus:ring-1 focus:ring-gray-900"
      />
      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
      {maxLength && (
        <p className="text-sm text-gray-500 mt-1">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
};
