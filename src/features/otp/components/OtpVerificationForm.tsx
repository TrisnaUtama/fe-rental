import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { useOtp } from "../hooks/useOtp";
import { useZodForm } from "@/shared/hooks/useZodForm";
import { OtpSchema } from "../utils/zod.schema";
import { toast } from "sonner";

function useOtpCountdown(expiryTime: number | null) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!expiryTime) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((expiryTime - now) / 1000);
      setRemaining(Math.max(diff, 0));
      if (diff <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  return remaining;
}

function extractZodOrGenericError(err: any, fallbackField: string = "code") {
  if (err?.errors && typeof err.errors === "object") return err.errors;
  return { [fallbackField]: err.message || "Something went wrong" };
}

export default function OtpVerificationForm() {
  const navigate = useNavigate();
  const { verified, getOtp, resendOtp, status } = useOtp();
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const remainingTime = useOtpCountdown(expiryTime);
  const [isLoading, setIsLoading] = useState(false);

  const {
    form,
    fieldErrors,
    handleChange,
    validateForm,
    resetForm,
    setFieldErrors,
  } = useZodForm(
    {
      user_id: "",
      code: "",
      email: "",
    },
    OtpSchema
  );

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      navigate("/sign-up");
      return;
    }
    handleChange("user_id", storedUserId);
    getOtp(storedUserId).then((data) => {
      if (data?.expiry_time) {
        const expiry = new Date(data.expiry_time).getTime();
        setExpiryTime(expiry);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await verified({
        user_id: form.user_id,
        code: form.code,
      });
      localStorage.removeItem("user_id");
      localStorage.removeItem("email");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      setFieldErrors((prev) => ({
        ...prev,
        ...extractZodOrGenericError(err),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const storedEmail = localStorage.getItem("email");
    const userId = form.user_id;
    if (!storedEmail || !userId) {
      navigate("/sign-up");
      return;
    }
    handleChange("email", storedEmail);
    try {
      const data = await resendOtp(userId, storedEmail);
      window.location.reload();
      if (data?.expiry_time) {
        setExpiryTime(new Date(data.expiry_time).getTime());
        resetForm();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify your account
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email or phone number
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "success" ? (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Verification successful!
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              {fieldErrors.code && (
                <Alert variant="destructive" className="mb-5">
                  <AlertCircle className="h-4 w-4 " />
                  <AlertTitle>Verification failed</AlertTitle>
                  <AlertDescription>{fieldErrors.code}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col items-center space-y-6">
                <InputOTP
                  maxLength={6}
                  value={form.code}
                  onChange={(val) => {
                    const numericOnly = val.replace(/\D/g, "");
                    handleChange("code", numericOnly);
                  }}
                  aria-label="OTP input"
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  type="submit"
                  disabled={form.code.length !== 6 || isLoading}
                  className={`${
                    form.code.length !== 6 || isLoading ? "" : "cursor-pointer"
                  } w-full`}
                >
                  {isLoading ? "Verifying..." : "Verify Account"}
                </Button>
              </div>

              <div className="text-center text-sm mt-4">
                <p className="text-muted-foreground">
                  Didn’t receive a code?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className={`p-0 h-auto bg-transparent text-primary font-medium text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed ${
                      remainingTime <= 0 && "cursor-pointer"
                    }`}
                    disabled={remainingTime < 0}
                  >
                    {remainingTime > 0
                      ? `Resend in ${remainingTime}s`
                      : "Resend code"}
                  </button>
                </p>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
