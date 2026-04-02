import { Home, Compass, Route, Briefcase, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", to: "/", icon: Home },
  { label: "Explore", to: "/places", icon: Compass },
  { label: "Route", to: "/route-generator", icon: Route },
  { label: "Booking", to: "/services", icon: Briefcase },
  { label: "Profile", to: "/profile", icon: User },
];

export function BottomTabBar() {
  return (
    <nav className="bottom-tab-bar" aria-label="Main navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className={({ isActive }) =>
            cn("bottom-tab-bar__item", isActive && "is-active")
          }
        >
          <tab.icon size={22} />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
