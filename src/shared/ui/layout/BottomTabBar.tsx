import { Bookmark, Compass, Home, Route, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";
import { cn } from "@/shared/lib/utils";

const tabs = [
  { labelKey: "tabs.home", to: "/", icon: Home },
  { labelKey: "tabs.service", to: "/service", icon: Compass },
  { labelKey: "tabs.route", to: "/route-generator", icon: Route },
  { labelKey: "tabs.saved", to: "/saved-booking", icon: Bookmark },
  { labelKey: "tabs.profile", to: "/profile", icon: User },
] as const;

export function BottomTabBar() {
  const { t } = useI18n();

  return (
    <nav className="bottom-tab-bar" aria-label={t("navigation.mainAria")}>
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
          <span>{t(tab.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
