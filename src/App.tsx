import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/loading";
import { Toaster } from "sonner";
import { AuthProvider } from "@/shared/context/authContex";
import AdminDashboard from "./features/dashboard/pages/Dashboard";
import ProtectedRoute from "./shared/routes/ProtectedRoute";
import { lazy } from "react";
import { type Roles } from "./shared/enum/enum";

export const SignUp = lazy(() => import("./features/auth/pages/SignUpPage"));
export const SignIn = lazy(() => import("./features/auth/pages/SignInPage"));
export const Verified = lazy(() => import("./features/otp/pages/page"));

const allowedRoles: Roles[] = [
  "SUPERADMIN",
  "ADMIN_OPERATIONAL",
  "ADMIN_FINANCE",
  "DRIVER",
];

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/verified" element={<Verified />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={allowedRoles}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
