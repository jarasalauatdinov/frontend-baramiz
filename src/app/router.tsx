import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/state/LoadingState";
import { RouteErrorBoundary } from "@/components/state/RouteErrorBoundary";

const HomePage = lazy(() => import("@/pages/HomePage").then((module) => ({ default: module.HomePage })));
const PlacesPage = lazy(() => import("@/pages/PlacesPage").then((module) => ({ default: module.PlacesPage })));
const PlaceDetailPage = lazy(() =>
  import("@/pages/PlaceDetailPage").then((module) => ({ default: module.PlaceDetailPage })),
);
const RouteGeneratorPage = lazy(() =>
  import("@/pages/RouteGeneratorPage").then((module) => ({ default: module.RouteGeneratorPage })),
);
const RouteResultPage = lazy(() =>
  import("@/pages/RouteResultPage").then((module) => ({ default: module.RouteResultPage })),
);
const ServicesPage = lazy(() => import("@/pages/ServicesPage").then((module) => ({ default: module.ServicesPage })));
const GuidesPage = lazy(() => import("@/pages/GuidesPage").then((module) => ({ default: module.GuidesPage })));
const EventsPage = lazy(() => import("@/pages/EventsPage").then((module) => ({ default: module.EventsPage })));
const AdminPlacesPage = lazy(() =>
  import("@/pages/AdminPlacesPage").then((module) => ({ default: module.AdminPlacesPage })),
);
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));

function PageFallback() {
  return (
    <div className="page">
      <LoadingState title="Loading page" copy="Preparing the next Baramiz screen." />
    </div>
  );
}

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: "places", element: withSuspense(<PlacesPage />) },
      { path: "places/:placeId", element: withSuspense(<PlaceDetailPage />) },
      { path: "route-generator", element: withSuspense(<RouteGeneratorPage />) },
      { path: "route-result", element: withSuspense(<RouteResultPage />) },
      { path: "services", element: withSuspense(<ServicesPage />) },
      { path: "guides", element: withSuspense(<GuidesPage />) },
      { path: "events", element: withSuspense(<EventsPage />) },
      { path: "admin", element: <Navigate to="/admin/places" replace /> },
      { path: "admin/places", element: withSuspense(<AdminPlacesPage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
