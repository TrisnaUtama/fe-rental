"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { User, Mail, Phone, Shield, Calendar, Eye, EyeOff } from "lucide-react";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { UpdateUserSchema } from "../utils/zod.schema";
import { useAuthContext } from "@/shared/context/authContex";
import { useUserById, useUpdateUser } from "../hooks/useUser";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { toast } from "sonner";

export default function UpdateUserForm() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

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
          navigate("/data-user");
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
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" />
                    <Label className="text-sm font-medium">Full Name</Label>
                  </div>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter full name"
                  />
                  {fieldErrors.name && (
                    <p className="text-red-600 mt-1 text-sm">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4" />
                    <Label className="text-sm font-medium">Email Address</Label>
                  </div>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="user@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 mt-1 text-sm">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Years of Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <Label className="text-sm font-medium">
                      Years of Experience
                    </Label>
                  </div>
                  <Input
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="50"
                    value={form.year_of_experiences ?? 0}
                    onChange={(e) =>
                      handleChange(
                        "year_of_experiences",
                        Number(e.target.value)
                      )
                    }
                    placeholder="0"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4" />
                    <Label className="text-sm font-medium">Phone Number</Label>
                  </div>
                  <Input
                    name="phone_number"
                    type="tel"
                    value={form.phone_number}
                    onChange={(e) =>
                      handleChange("phone_number", e.target.value)
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                  {fieldErrors.phone_number && (
                    <p className="text-red-600 mt-1 text-sm">
                      {fieldErrors.phone_number}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="text-sm font-medium">Status</Label>
                  </div>
                  <select
                    name="status"
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="">Select status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  {fieldErrors.status && (
                    <p className="text-red-600 mt-1 text-sm">
                      {fieldErrors.status}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4" />
                    <Label className="text-sm font-medium">Role</Label>
                  </div>
                  <select
                    name="role"
                    value={form.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="">Select user role</option>
                    <option value="ADMIN_OPERATIONAL">Admin Operasional</option>
                    <option value="ADMIN_FINANCE">Admin Finance</option>
                    <option value="DRIVER">Driver</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                  {fieldErrors.role && (
                    <p className="text-red-600 mt-1 text-sm">
                      {fieldErrors.role}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="text-sm font-medium">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Enter secure password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-600 mt-1 text-sm">
                      {fieldErrors.password}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  disabled={isPending}
                >
                  {isPending ? <LoadingSpinner /> : "Update User"}
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
