import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-header__copy">
        {eyebrow ? <span className="section-header__eyebrow">{eyebrow}</span> : null}
        <h2 className="section-header__title">{title}</h2>
        {subtitle ? <p className="section-header__subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="section-header__action">{action}</div> : null}
    </div>
  );
}
