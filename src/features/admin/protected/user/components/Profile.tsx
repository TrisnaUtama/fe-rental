
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, ArrowLeft } from "lucide-react"; 


import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { FormInput } from "@/shared/components/ui/form-field";
import { FormPasswordInput } from "@/shared/components/ui/form-password";
import LoadingSpinner from "@/features/redirect/pages/Loading";

import { useZodForm } from "@/shared/hooks/useZodForm";
import { useAuthContext } from "@/shared/context/authContex";
import { useUserById, useUpdateUser } from "../hooks/useUser";
import { UpdateUserSchema } from "../utils/zod.schema";

export default function ProfilePage() {
  const navigate = useNavigate(); 
  const { user, accessToken, updateUser } = useAuthContext();

  const {
    data: userData,
    isLoading: isFetchingUser,
    isError,
  } = useUserById(user?.id!, accessToken || "");

  const { mutate, isPending } = useUpdateUser(accessToken || "");

  const { form, fieldErrors, handleChange, setFieldErrors, setForm } =
    useZodForm(
      {
        name: "",
        email: "",
        phone_number: "",
        password: "",
        role: "",
        year_of_experiences: 0,
      },
      UpdateUserSchema
    );

  useEffect(() => {
    if (userData?.data) {
      setForm({
        name: userData.data.name || "",
        email: userData.data.email || "",
        phone_number: userData.data.phone_number || "",
        password: "", 
        role: userData.data.role || "",
        year_of_experiences: userData.data.year_of_experiences || 0,
      });
    }
  }, [userData, setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit: any = {
      name: form.name,
      phone_number: form.phone_number,
      password: form.password,
    };

    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    mutate(
      {
        userId: user!.id,
        data: dataToSubmit,
      },
      {
        onSuccess: (res) => {
          updateUser(res.data);
          toast.success("Profile updated successfully!");
          navigate(-1)
        },
        onError: (err: any) => {
          if (err?.errors) {
            setFieldErrors((prev) => ({ ...prev, ...err.errors }));
            toast.error("Update failed. Please check the fields.");
          } else {
            const errorMessage = err.message || "An unexpected error occurred.";
            setFieldErrors((prev) => ({ ...prev, general: errorMessage }));
            toast.error(errorMessage);
          }
        },
      }
    );
  };

  const handleReset = () => {
    if (userData?.data) {
      setForm({
        ...form,
        name: userData.data.name,
        email: userData.data.email,
        phone_number: userData.data.phone_number,
        password: "",
      });
      setFieldErrors({});
      toast.info("Form has been reset.");
    }
  };

  if (isFetchingUser) return <LoadingSpinner />;
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 p-8">Failed to load your profile data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex items-center justify-center">
        <Card className="w-full max-w-4xl grid md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden border-0">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 flex flex-col items-center justify-center text-center">
            <div className="w-28 h-28 rounded-full bg-slate-700 flex items-center justify-center text-5xl font-bold mb-4 border-4 border-slate-500">
              {form.name ? form.name.charAt(0).toUpperCase() : <User />}
            </div>
            <h2 className="text-2xl font-bold">{form.name}</h2>
            <p className="text-slate-400 mt-1">{form.email}</p>
          </div>

          <div className="p-10">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-3xl font-bold text-slate-800">
                My Profile
              </CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  name="name"
                  label="Full Name"
                  icon={User}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter full name"
                  error={fieldErrors.name}
                />
                <FormInput
                  name="email"
                  label="Email"
                  icon={Mail}
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="user@example.com"
                  disabled
                  error={fieldErrors.email}
                />
                <FormInput
                  name="phone_number"
                  type="tel"
                  label="Phone Number"
                  icon={Phone}
                  value={form.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="Enter phone number"
                  error={fieldErrors.phone_number}
                />
                <FormPasswordInput
                  name="password"
                  label="New Password"
                  icon={Lock}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={fieldErrors.password}
                  helperText="Fill this in only if you want to change your password."
                />

                {fieldErrors.general && (
                  <p className="text-red-600 text-sm text-center">
                    {fieldErrors.general}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-slate-900 text-white hover:bg-slate-800 transition-transform transform hover:scale-105"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 transition-transform transform hover:scale-105"
                    onClick={handleReset}
                    disabled={isPending}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}