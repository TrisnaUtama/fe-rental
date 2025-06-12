import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./features/redirect/pages/Loading";
import { Toaster } from "sonner";
import { AuthProvider } from "@/shared/context/authContex";
import ProtectedRoute from "./shared/routes/ProtectedRoute";
import { lazy } from "react";
import SidebarLayout from "./shared/components/layout/admin/sidebar/sidebar-layout";
import CustomerLayout from "./shared/components/layout/customer/sidebar/customer-layout";
import { customerRoute, pageRoutes } from "./shared/routes/pages.route";
import { routeConfigs } from "./shared/routes/sidebar.route";
import { CartProvider } from "./shared/context/cartContext";

// Lazy-loaded components...
const SignUpStaff = lazy(() => import("./features/auth/pages/SignUpPage"));
const SignInStaff = lazy(() => import("./features/auth/pages/SignInPage"));
const Verified = lazy(() => import("./features/otp/pages/page"));
const LandingPage = lazy(() => import("./features/customer/landing/pages/LandingPage"));
const CatalogVehicle = lazy(() => import("./features/customer/vehicle/pages/CatalogPage"));
const CatalogTravelPack = lazy(() => import("./features/customer/travelpackage/pages/CatalogPage"));
const CatalogDestination = lazy(() => import("./features/customer/destination/pages/CatalogPage"));
const DetailTravelPack = lazy(() => import("./features/customer/travelpackage/pages/DetailPage"));
const DetailDestination = lazy(() => import("./features/customer/destination/pages/DetailPage"));
const Unauthorized = lazy(() => import("./features/redirect/pages/Unauthorized"));
const NotFound = lazy(() => import("./features/redirect/pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster richColors />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Customer Public Routes (No changes needed here) */}
              <Route path="/car-rental" element={<CustomerLayout><LandingPage /></CustomerLayout>} />
              <Route path="/rentals" element={<CatalogVehicle />} />
              <Route path="/destination" element={<CustomerLayout><LandingPage /></CustomerLayout>} />
              <Route path="/destinations" element={<CatalogDestination />} />
              <Route path="/destination/:id" element={<DetailDestination />} />
              <Route path="/travel" element={<CustomerLayout><LandingPage /></CustomerLayout>} />
              <Route path="/travels" element={<CatalogTravelPack />} />
              <Route path="/travel/:id" element={<DetailTravelPack />} />

              {/* Auth and other public routes (No changes needed here) */}
              <Route path="/" element={<SignInStaff />} />
              <Route path="/sign-up" element={<SignUpStaff />} />
              <Route path="/staff/verified" element={<Verified />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />

              {/* Protected Admin/Staff Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <SidebarLayout />
                  </ProtectedRoute>
                }
              >
                {/* --- THIS IS THE CORRECTED ROUTING LOGIC --- */}
                {routeConfigs.flatMap((route) => {
                  // If the route has sub-items, map over them to create routes
                  if (route.subItems) {
                    return route.subItems.map((subItem) => {
                      const SubComponent = subItem.component;
                      return (
                        <Route
                          key={subItem.url}
                          path={subItem.url}
                          element={
                            <ProtectedRoute allowedRoles={subItem.roles}>
                              <SubComponent />
                            </ProtectedRoute>
                          }
                        />
                      );
                    });
                  }

                  // If the route has a component but no sub-items, create a single route
                  if (route.component) {
                    const Component = route.component;
                    return (
                      <Route
                        key={route.url}
                        path={route.url}
                        element={
                          <ProtectedRoute allowedRoles={route.roles}>
                            <Component />
                          </ProtectedRoute>
                        }
                      />
                    );
                  }
                  return null;
                })}

                {/* Non-sidebar pages (No changes needed here) */}
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

              {/* Customer Protected Route (No changes needed here) */}
              {customerRoute.map(({ path, element: Component, roles }) => (
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
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
