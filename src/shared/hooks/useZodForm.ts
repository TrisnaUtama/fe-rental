import { useState } from "react";
import { ZodSchema } from "zod";

type FieldErrors<T> = Partial<Record<keyof T | "general", string>>;

export function useZodForm<T extends Record<string, any>>(
  initialForm: T,
  schema: ZodSchema<T>
) {
  const [form, setForm] = useState<T>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<T>>({});

  const handleChange = (field: keyof T, value: T[keyof T]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];        
      delete newErrors.general;      
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const result = schema.safeParse(form);
    if (!result.success) {
      const errors: FieldErrors<T> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (path && typeof path === "string") {
          errors[path as keyof T] = issue.message;
        } else {
          errors.general = issue.message;
        }
      }
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const resetForm = () => {
    setForm(initialForm);
    setFieldErrors({});
  };

  return {
    form,
    setForm,
    fieldErrors,
    setFieldErrors,
    handleChange,
    validateForm,
    resetForm,
  };
}
