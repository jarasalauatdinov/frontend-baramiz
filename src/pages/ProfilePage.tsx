import {
  Bookmark,
  ChevronRight,
  HelpCircle,
  LogOut,
  MapPin,
  Settings,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: MapPin, label: "My Routes", to: "/route-result", color: "#D97706" },
  { icon: Bookmark, label: "Saved Places", to: "/places", color: "#0F766E" },
  { icon: Star, label: "Favorites", to: "/places", color: "#E8590C" },
  { icon: Settings, label: "Settings", to: "/profile", color: "#6366F1" },
  { icon: HelpCircle, label: "Help & Support", to: "/profile", color: "#0EA5E9" },
  { icon: Shield, label: "Privacy Policy", to: "/profile", color: "#8B5CF6" },
];

export function ProfilePage() {
  return (
    <div className="screen">
      <div className="profile-header">
        <div className="profile-avatar">
          <Sparkles size={28} />
        </div>
        <h2 className="profile-name">Traveler</h2>
        <p className="profile-email">explorer@baramiz.app</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <strong>12</strong>
            <span>Routes</span>
          </div>
          <div className="profile-stat">
            <strong>48</strong>
            <span>Places</span>
          </div>
          <div className="profile-stat">
            <strong>5</strong>
            <span>Cities</span>
          </div>
        </div>
      </div>

      <div className="profile-menu">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.to} className="profile-menu__item">
            <span
              className="profile-menu__icon"
              style={{ background: `${item.color}18`, color: item.color }}
            >
              <item.icon size={20} />
            </span>
            <span className="profile-menu__label">{item.label}</span>
            <ChevronRight size={18} className="profile-menu__chevron" />
          </Link>
        ))}
      </div>

      <div className="profile-footer">
        <button type="button" className="profile-logout">
          <LogOut size={18} />
          Sign Out
        </button>
        <p className="profile-version">Baramiz v1.0.0</p>
      </div>
    </div>
  );
}
