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
  Lock,
  ToggleRight,
} from "lucide-react";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { CreateUserSchema } from "../utils/zod.schema";
import { useCreateUser } from "../hooks/useUser";
import { useAuthContext } from "@/shared/context/authContex";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FormInput } from "@/shared/components/ui/form-field";
import { FormSelect } from "@/shared/components/ui/form-select";
import { FormPasswordInput } from "@/shared/components/ui/form-password";

export default function CreateUserForm() {
  const { accessToken } = useAuthContext();
  const { mutate, isPending } = useCreateUser(accessToken || "");
  const navigate = useNavigate();

  const {
    form,
    fieldErrors,
    handleChange,
    validateForm,
    setFieldErrors,
    resetForm,
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
    CreateUserSchema
  );

  const handleReset = () => {
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submissionPayload = {
      ...form,
      year_of_experiences: Number(form.year_of_experiences),
    };

    mutate(submissionPayload, {
      onSuccess: () => {
        toast.success("User created successfully!");
        resetForm();
        navigate("/staff/data-user");
        window.location.reload();
      },
      onError: (err: any) => {
        if (err?.errors && typeof err.errors === "object") {
          setFieldErrors((prev: any) => ({
            ...prev,
            ...err.errors,
          }));
        } else {
          setFieldErrors((prev) => ({
            ...prev,
            general: err.message || "Unknown error occurred",
          }));
          toast.error("Failed to create user.");
        }
      },
    });
  };

  if (isPending ) {
      <LoadingSpinner />;
    }

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
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter full name"
                  error={fieldErrors.name}
                />

                {/* Email */}
                <FormInput
                  name="email"
                  label="Email"
                  icon={Mail}
                  value={form.email}
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
                  value={form.year_of_experiences}
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
                  value={form.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  error={fieldErrors.phone_number}
                />

                {/* Status */}
                <FormSelect
                  name="status"
                  label="Status"
                  icon={ToggleRight}
                  value={form.status}
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
