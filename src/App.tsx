import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./features/redirect/pages/Loading";
import { Toaster } from "sonner";
import { AuthProvider } from "@/shared/context/authContex";
import ProtectedRoute from "./shared/routes/ProtectedRoute";
import { lazy } from "react";
import SidebarLayout from "./shared/components/layout/sidebar/sidebar-layout";
import { pageRoutes } from "./shared/routes/pages.route";
import { routeConfigs } from "./shared/routes/sidebar.route";

const SignUp = lazy(() => import("./features/auth/pages/SignUpPage"));
const SignIn = lazy(() => import("./features/auth/pages/SignInPage"));
const Verified = lazy(() => import("./features/otp/pages/page"));
const Unauthorized = lazy(
  () => import("./features/redirect/pages/Unauthorized")
);
const NotFound = lazy(() => import("./features/redirect/pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/verified" element={<Verified />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />

            {/* Dynamically generated protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <SidebarLayout />
                </ProtectedRoute>
              }
            >
              {/* Sidebar routes */}
              {routeConfigs.map(({ url, component: Component, roles }) => (
                <Route
                  key={url}
                  path={url}
                  element={
                    <ProtectedRoute allowedRoles={roles}>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              ))}

              {/* Non-sidebar pages */}
              {pageRoutes.map(({ path, element: Component, roles }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute allowedRoles={roles}>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
