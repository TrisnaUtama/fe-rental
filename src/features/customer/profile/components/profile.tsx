import React, { useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Camera } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { useAuthContext } from "@/shared/context/authContex";
import {
  useUserById,
  useUpdateUser,
} from "@/features/admin/protected/user/hooks/useUser";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { UpdateUserSchema } from "@/features/admin/protected/user/utils/zod.schema";
import { useNavigate } from "react-router-dom";

export default function CustomerProfilePage() {
  const { user, accessToken, updateUser: update } = useAuthContext();
  const {
    data: userData,
    isLoading: isFetchingUser,
    isError,
  } = useUserById(user?.id!, accessToken || "");
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(
    accessToken || ""
  );
  const navigate = useNavigate();

  const { form, fieldErrors, handleChange, validateForm, setForm } = useZodForm(
    {
      name: "",
      email: "",
      phone_number: "",
      password: "",
    },
    UpdateUserSchema.pick({
      name: true,
      email: true,
      phone_number: true,
      password: true,
    })
  );

  useEffect(() => {
    if (userData?.data) {
      setForm({
        name: userData.data.name || "",
        email: userData.data.email || "",
        phone_number: userData.data.phone_number || "",
        password: "",
      });
    }
  }, [userData, setForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please review your input.", {
        style: { background: "red", color: "white" },
      });
      return;
    }

    updateUser(
      {
        userId: user!.id,
        data: {
          ...form,
          role: userData?.data.role || "",
          year_of_experiences: 0,
        },
      },
      {
        onSuccess: (res) => {
          update(res.data);
          toast.success("Profile updated successfully!");
          navigate("/car-rental");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update profile.");
        },
      }
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isFetchingUser) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load profile data.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          className="lg:col-span-1"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-lg overflow-hidden border-0">
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-5xl font-bold">
                  {userData?.data.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all transform hover:scale-110">
                  <Camera className="w-5 h-5 text-blue-500" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-black">
                {userData?.data.name}
              </h2>
              <p className="text-gray-500 mt-1">{userData?.data.email}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-black">
                  Edit Profile
                </CardTitle>
                <CardDescription>
                  Update your personal details here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-black">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-red-500 text-sm">{fieldErrors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-black">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone_number"
                      value={form.phone_number}
                      onChange={(e) =>
                        handleChange("phone_number", e.target.value)
                      }
                      className="pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {fieldErrors.phone_number && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.phone_number}
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-2">
                  <Label htmlFor="password" className="text-black">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Fill to change password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
