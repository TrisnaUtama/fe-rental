import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { signUpSchema } from "../utils/zod.schema";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useAuth } from "../hooks/useAuth";

export default function SignUpForm() {
  const status = useAppSelector((state) => state.auth.status);
  const Auth = useAuth();
  const {
    form,
    fieldErrors,
    handleChange,
    validateForm,
    resetForm,
    setFieldErrors,
  } = useZodForm(
    {
      firstName: "",
      lastName: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
    signUpSchema
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () =>
    setShowPassword((prev: boolean) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev: boolean) => !prev);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const normalizedName = `${form.firstName} ${form.lastName}`;

    const payload = {
      name: normalizedName,
      email: form.email,
      phone_number: form.phone_number,
      password: form.password,
    };

    try {
      const result = await Auth.signUp(payload);
      if (
        result.meta.requestStatus === "fulfilled" &&
        result.payload &&
        typeof result.payload !== "string"
      ) {
        const res = result.payload;

        toast.success("Success", {
          description: `Success create new account with name ${res.data.name}`,
          position: "bottom-right",
          duration: 3000,
          style: {
            backgroundColor: "#16a34a",
            color: "white",
          },
        });
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("email", res.data.email);
        navigate("/verified");
        resetForm();
      } else {
        toast.error("Sign Up failed", {
          description: result.payload?.toString() || "Invalid Response",
          position: "bottom-right",
        });
      }
    } catch (err: any) {
      if (err?.errors && typeof err.errors === "object") {
        setFieldErrors((prev) => ({
          ...prev,
          ...err.errors,
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          ...err.message,
        }));
      }
    }
  };

  console.log(status);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className="border-black/10 shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-black">
              Create an account
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-black">
                  First name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="border-black/20 focus-visible:ring-black"
                />
                {fieldErrors.firstName && (
                  <p className="text-sm text-red-600">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-black">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="border-black/20 focus-visible:ring-black"
                />
                {fieldErrors.lastName && (
                  <p className="text-sm text-red-600">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border-black/20 focus-visible:ring-black"
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-black">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="+62 812-3456-7890"
                value={form.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                className="border-black/20 focus-visible:ring-black"
              />
              {fieldErrors.phone_number && (
                <p className="text-sm text-red-600">
                  {fieldErrors.phone_number}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="border-black/20 focus-visible:ring-black pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-black/70 hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-black">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className="border-black/20 focus-visible:ring-black pr-10"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-black/70 hover:text-black"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90 cursor-pointer"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating..." : "Create account"}
            </Button>
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-black underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
