import { Outlet } from "react-router-dom";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export function AppShell() {
  return (
    <div className="app-container">
      <div className="app-container__inner">
        <main className="app-content">
          <Outlet />
        </main>
        <BottomTabBar />
      </div>
    </div>
  );
}
