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
import { Link, useNavigate } from "react-router-dom";
import { signInSchema } from "../utils/zod.schema";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/shared/context/authContex";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useAuth } from "../hooks/useAuth";

// Your interface definition
export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: { // Make data optional to handle failed logins
    user_id: string;
    role: string;
    email: string;
    name: string;
  };
  access_token?: string; // Make token optional
}

export default function SignInForm() {
  const status = useAppSelector((state) => state.auth.status);
  const Auth = useAuth();
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { form, fieldErrors, handleChange, validateForm, setFieldErrors } =
    useZodForm(
      {
        email: "",
        password: "",
      },
      signInSchema
    );

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // =========================================================================
  // FINAL CORRECTED LOGIC
  // =========================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await Auth.signIn(form.email, form.password);

      if (result.meta.requestStatus === "fulfilled" && result.payload) {
        let res: IAuthResponse;

        // =========================================================================
        // FINAL FIX: Check if payload is a string before parsing.
        // If it's already an object, just use it.
        // =========================================================================
        if (typeof result.payload === "string") {
          res = JSON.parse(result.payload);
        } else {
          res = result.payload as IAuthResponse; // It's already the object we need
        }

        if (res.success === true && res.data && res.access_token) {
          // --- SUCCESS PATH ---
          const user = {
            id: res.data.user_id,
            role: res.data.role,
            email: res.data.email,
            name: res.data.name,
          };

          login(user, res.access_token);
          
          toast.success("Success", {
            description: `Welcome ${res.data.name}`,
            position: "bottom-right",
          });

          if (user.role === "CUSTOMER") {
            navigate("/car-rental", { replace: true });
          } else {
            navigate("/staff/dashboard", { replace: true });
          }
        } else {
          // --- FAILURE PATH ---
          setFieldErrors((prev) => ({
            ...prev,
            general: res.message || "Invalid credentials.",
          }));
        }
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          general: "Login failed. Please try again.",
        }));
      }
    } catch (err: any) {
      console.error("A critical error occurred:", err);
      setFieldErrors((prev) => ({
        ...prev,
        general: "An unknown error occurred. Please try again.",
      }));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-black/10 shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">
            Sign in
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border-black/20 focus-visible:ring-black"
                aria-invalid={!!fieldErrors.email}
                aria-describedby="email-error"
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-sm text-red-600">
                  {fieldErrors.email}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="border-black/20 focus-visible:ring-black pr-10"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby="password-error"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {fieldErrors.general && (
              <p className="text-sm text-red-600">{fieldErrors.general}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="text-black underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
