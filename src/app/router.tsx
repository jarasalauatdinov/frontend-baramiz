import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom";
import { readOnboardingCompleted } from "@/features/onboarding/model/storage";
import { readStoredLanguage } from "@/features/language-switcher";
import { resolveStartupDestination } from "@/features/startup/model/resolve-startup-destination";
import { StartupSplash } from "@/features/startup/ui/StartupSplash";
import { AppShell } from "@/shared/ui/layout/AppShell";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { RouteErrorBoundary } from "@/shared/ui/state/RouteErrorBoundary";

const LanguageSelectionPage = lazy(() =>
  import("@/pages/LanguageSelectionPage").then((module) => ({ default: module.LanguageSelectionPage })),
);
const OnboardingPage = lazy(() =>
  import("@/pages/OnboardingPage").then((module) => ({ default: module.OnboardingPage })),
);
const HomePage = lazy(() => import("@/pages/HomePage").then((module) => ({ default: module.HomePage })));
const PlacesPage = lazy(() => import("@/pages/PlacesPage").then((module) => ({ default: module.PlacesPage })));
const PlaceDetailPage = lazy(() =>
  import("@/pages/PlaceDetailPage").then((module) => ({ default: module.PlaceDetailPage })),
);
const ServiceHubPage = lazy(() => import("@/pages/ServiceHubPage").then((module) => ({ default: module.ServiceHubPage })));
const ServiceCategoryPage = lazy(() => import("@/pages/ServiceCategoryPage").then((module) => ({ default: module.ServiceCategoryPage })));
const ServiceItemDetailPage = lazy(() =>
  import("@/pages/ServiceItemDetailPage").then((module) => ({ default: module.ServiceItemDetailPage })),
);
const SuyleAIPage = lazy(() => import("@/pages/SuyleAIPage").then((module) => ({ default: module.SuyleAIPage })));
const LoginPage = lazy(() => import("@/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() =>
  import("@/pages/RegisterPage").then((module) => ({ default: module.RegisterPage })),
);
const RouteGeneratorPage = lazy(() =>
  import("@/pages/RouteGeneratorPage").then((module) => ({ default: module.RouteGeneratorPage })),
);
const GuidesPage = lazy(() => import("@/pages/GuidesPage").then((module) => ({ default: module.GuidesPage })));
const EventsPage = lazy(() => import("@/pages/EventsPage").then((module) => ({ default: module.EventsPage })));
const AdminPlacesPage = lazy(() =>
  import("@/pages/AdminPlacesPage").then((module) => ({ default: module.AdminPlacesPage })),
);
const ProfilePage = lazy(() =>
  import("@/pages/ProfilePage").then((module) => ({ default: module.ProfilePage })),
);
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));

function PageFallback() {
  return (
    <div className="screen screen--center">
      <LoadingState />
    </div>
  );
}

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>;
}

function StartupGate() {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsReady(true), 420);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isReady) {
    return <StartupSplash />;
  }

  const destination = resolveStartupDestination({
    hasLanguage: readStoredLanguage() !== null,
    isOnboarded: readOnboardingCompleted(),
    pathname: location.pathname,
  });

  if (destination) {
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <StartupGate />,
    children: [
      { path: "/select-language", element: withSuspense(<LanguageSelectionPage />) },
      { path: "/onboarding", element: withSuspense(<OnboardingPage />) },
      {
        path: "/",
        element: <AppShell />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: withSuspense(<HomePage />) },
          { path: "places", element: withSuspense(<PlacesPage />) },
          { path: "places/:placeId", element: withSuspense(<PlaceDetailPage />) },
          { path: "service", element: withSuspense(<ServiceHubPage />) },
          { path: "service/:categorySlug", element: withSuspense(<ServiceCategoryPage />) },
          { path: "service/:categorySlug/:itemSlug", element: withSuspense(<ServiceItemDetailPage />) },
          { path: "suyle-ai", element: withSuspense(<SuyleAIPage />) },
          { path: "suyle", element: <Navigate to="/suyle-ai" replace /> },
          { path: "speak", element: <Navigate to="/suyle-ai" replace /> },
          { path: "route", element: withSuspense(<RouteGeneratorPage />) },
          { path: "route-generator", element: <Navigate to="/route" replace /> },
          { path: "route-result", element: <Navigate to="/route" replace /> },
          { path: "login", element: withSuspense(<LoginPage />) },
          { path: "register", element: withSuspense(<RegisterPage />) },
          { path: "services", element: <Navigate to="/service/services" replace /> },
          { path: "guides", element: withSuspense(<GuidesPage />) },
          { path: "events", element: withSuspense(<EventsPage />) },
          { path: "profile", element: withSuspense(<ProfilePage />) },
          { path: "admin", element: <Navigate to="/admin/places" replace /> },
          { path: "admin/places", element: withSuspense(<AdminPlacesPage />) },
          { path: "*", element: withSuspense(<NotFoundPage />) },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
