import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "@/widgets/bottom-nav";

export function AppShell() {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";

  return (
    <div className={`app-container${isHomeRoute ? " app-container--home" : ""}`}>
      <div className={`app-container__inner${isHomeRoute ? " app-container__inner--home" : ""}`}>
        <main className={`app-content${isHomeRoute ? " app-content--home" : ""}`}>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
