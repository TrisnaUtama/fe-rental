"use client";

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  ToggleRight,
  Lock,
} from "lucide-react";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { UpdateUserSchema } from "../utils/zod.schema";
import { useAuthContext } from "@/shared/context/authContex";
import { useUserById, useUpdateUser } from "../hooks/useUser";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { toast } from "sonner";
import { FormInput } from "@/shared/components/ui/form-field";
import { FormSelect } from "@/shared/components/ui/form-select";
import { FormPasswordInput } from "@/shared/components/ui/form-password";

export default function UpdateUserForm() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();

  const {
    data,
    isLoading: isFetchingUser,
    isError,
  } = useUserById(userId!, accessToken || "");

  const { mutate, isPending } = useUpdateUser(accessToken || "");

  const {
    form,
    fieldErrors,
    handleChange,
    validateForm,
    setFieldErrors,
    setForm,
  } = useZodForm(
    {
      email: "",
      password: "",
      name: "",
      phone_number: "",
      role: "",
      status: "",
      year_of_experiences: 0,
    },
    UpdateUserSchema
  );
  const statusForm = data?.data.status ? "true" : "false";
  useEffect(() => {
    if (data?.data) {
      setForm({
        email: data.data.email,
        password: data.data.password,
        name: data.data.name,
        phone_number: data.data.phone_number,
        role: data.data.role,
        status: data.data.status ? "true" : "false",
        year_of_experiences: data.data.year_of_experiences,
      });
    }
  }, [data, setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const statusBoolean = form.status === "true";
    mutate(
      {
        userId: userId!,
        data: {
          ...form,
          year_of_experiences: Number(form.year_of_experiences),
          status: statusBoolean,
          id: "",
        },
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully!");
          navigate("/staff/data-user");
          window.location.reload();
        },
        onError: (err: any) => {
          if (err?.errors) {
            setFieldErrors((prev) => ({
              ...prev,
              ...err.errors,
            }));
          } else {
            setFieldErrors((prev) => ({
              ...prev,
              general: err.message || "Update failed.",
            }));
            toast.error("Failed to update user.");
          }
        },
      }
    );
  };

  const handleReset = () => {
    if (data?.data) {
      setForm({
        email: data.data.email,
        password: data.data.password,
        name: data.data.name,
        phone_number: data.data.phone_number,
        role: data.data.role,
        status: statusForm,
        year_of_experiences: data.data.year_of_experiences,
      });
    }
  };

  if (isFetchingUser) return <LoadingSpinner />;
  if (isPending) {
    <LoadingSpinner />;
  }
  if (isError) return <p className="text-red-500">Failed to load user data.</p>;

  return (
    <div>
      <div className="mx-auto max-w-4xl">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Create New User
            </CardTitle>
            <CardDescription>
              Fill in the details below to create a new user account
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <FormInput
                  name="name"
                  label="Full Name"
                  icon={User}
                  value={form.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter full name"
                  error={fieldErrors.name}
                />

                {/* Email */}
                <FormInput
                  name="email"
                  label="Email"
                  icon={Mail}
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="user@example.com"
                  error={fieldErrors.email}
                />

                {/* Years of Experience */}
                <FormInput
                  name="yearsOfExperience"
                  type="number"
                  label="Years of Experience"
                  icon={Calendar}
                  value={form.year_of_experiences || ""}
                  onChange={(e) =>
                    handleChange("year_of_experiences", e.target.value)
                  }
                  placeholder="0"
                  error={fieldErrors.year_of_experiences}
                />

                {/* Phone Number */}
                <FormInput
                  name="phone_number"
                  type="tel"
                  label="Phone Number"
                  icon={Phone}
                  value={form.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  error={fieldErrors.phone_number}
                />

                {/* Status */}
                <FormSelect
                  name="status"
                  label="Status"
                  icon={ToggleRight}
                  value={form.status || ""}
                  onChange={(e) => handleChange("status", e.target.value)}
                  error={fieldErrors.status}
                  options={[
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ]}
                />

                {/* Role */}
                <FormSelect
                  name="role"
                  label="Role"
                  icon={Shield}
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  error={fieldErrors.status}
                  options={[
                    { label: "Admin Operasional", value: "ADMIN_OPERATIONAL" },
                    { label: "Admin Finance", value: "ADMIN_FINANCE" },
                    { label: "Driver", value: "DRIVER" },
                    { label: "Customer", value: "CUSTOMER" },
                  ]}
                />

                {/* Password */}
                <div className="md:col-span-2">
                  <FormPasswordInput
                    name="password"
                    label="Password"
                    icon={Lock}
                    value={form.password}
                    onChange={(e: { target: { value: string | number } }) =>
                      handleChange("password", e.target.value)
                    }
                    error={fieldErrors.password}
                    helperText="Password must be at least 6 characters long"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Create User
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleReset}
                  disabled={isPending}
                >
                  Reset Form
                </Button>
              </div>

              {fieldErrors.general && (
                <p className="text-red-600 mt-2">{fieldErrors.general}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
