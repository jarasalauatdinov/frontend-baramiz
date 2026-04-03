import { cn } from "@/shared/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  copy: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, copy, className }: SectionHeadingProps) {
  return (
    <div className={cn("section-header", className)}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title display">{title}</h2>
      <p className="section-copy">{copy}</p>
    </div>
  );
}
